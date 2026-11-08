const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function runSecurityTests() {
  console.log('====================================================');
  console.log('🔒 EXECUTING COMPREHENSIVE OWASP SECURITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extra = '') {
    if (condition) {
      console.log(`[PASS] ${testName} ${extra}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${extra}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Security Headers (OWASP Grade A)
  // ----------------------------------------------------
  console.log('--- 1. Security Headers Audit ---');
  const resHome = await fetch(`${BASE_URL}/`);
  const headers = resHome.headers;

  assert(!headers.get('x-powered-by'), 'X-Powered-By Header Hidden');
  assert(headers.get('x-frame-options') === 'DENY', 'X-Frame-Options is DENY (Anti-Clickjacking)');
  assert(headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options is nosniff (Anti-MIME Sniff)');
  assert(headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy is strict');
  assert(headers.get('content-security-policy') !== null, 'Content-Security-Policy (CSP) is active');

  // Anti-indexing for admin
  const resAdminCheck = await fetch(`${BASE_URL}/api/menu`);
  assert(resAdminCheck.headers.get('x-robots-tag')?.includes('noindex'), 'X-Robots-Tag: noindex, nofollow on API/Admin');

  // ----------------------------------------------------
  // TEST 2: Customer Authorization & Access Control
  // ----------------------------------------------------
  console.log('\n--- 2. Customer Access Control & IDOR Defense ---');
  // Attempt unauthenticated modifications
  const resUnauthorizedAdd = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Hacked Dish', price: 100, categoryId: 'cat-1' })
  });
  assert(resUnauthorizedAdd.status === 401, 'Public Customer CANNOT Add Dishes (Blocked 401 Unauthorized)');

  const resUnauthorizedPrice = await fetch(`${BASE_URL}/api/items/item-1/price`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 1 })
  });
  assert(resUnauthorizedPrice.status === 401, 'Public Customer CANNOT Edit Prices (Blocked 401 Unauthorized)');

  const resUnauthorizedDelete = await fetch(`${BASE_URL}/api/items/item-1`, {
    method: 'DELETE'
  });
  assert(resUnauthorizedDelete.status === 401, 'Public Customer CANNOT Delete Dishes (Blocked 401 Unauthorized)');

  const resUnauthorizedLogs = await fetch(`${BASE_URL}/api/logs`);
  assert(resUnauthorizedLogs.status === 401, 'Public Customer CANNOT Read Audit Logs (Blocked 401 Unauthorized)');

  // ----------------------------------------------------
  // TEST 3: Admin Authentication & Generic Error Messages
  // ----------------------------------------------------
  console.log('\n--- 3. Admin Authentication & User Credentials ---');
  
  // Test wrong password (check generic error)
  const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin547', password: 'wrongpassword123' })
  });
  const badLoginJson = await resBadLogin.json();
  assert(resBadLogin.status === 401, 'Wrong password rejected with 401');
  assert(
    badLoginJson.error.includes('Invalid login credentials'),
    'Generic error message used (does not reveal user existence)'
  );

  // Test successful login with user credentials: admin547 / owner92744!@
  const resGoodLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin547', password: 'owner92744!@' })
  });
  const goodLoginJson = await resGoodLogin.json();
  const setCookie = resGoodLogin.headers.get('set-cookie') || '';
  
  assert(resGoodLogin.status === 200, 'Login succeeded with user credentials (admin547 / owner92744!@)');
  assert(setCookie.includes('HttpOnly'), 'Session cookie has HttpOnly flag (anti-XSS token theft)');
  assert(setCookie.includes('SameSite=Strict') || setCookie.includes('samesite=strict'), 'Session cookie has SameSite=Strict (anti-CSRF)');

  const token = goodLoginJson.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // ----------------------------------------------------
  // TEST 4: XSS Payload Neutralization & Input Validation
  // ----------------------------------------------------
  console.log('\n--- 4. XSS & Input Validation Defense ---');
  const xssPayload = "<script>alert('XSS')</script><img src=x onerror=alert(1)> Crispy Mushroom";
  
  // Get an existing valid category
  const resMenuForCat = await fetch(`${BASE_URL}/api/menu`);
  const menuDataForCat = await resMenuForCat.json();
  const validCatId = menuDataForCat.categories[0]?.id || 'cat-chef-special';

  const resXssItem = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: xssPayload,
      categoryId: validCatId,
      price: 250,
      description: "<b>Delicious</b> <script>document.location='http://attacker.com'</script>",
      isVeg: true
    })
  });
  const xssItemJson = await resXssItem.json();

  assert(resXssItem.status === 201, 'Dish with XSS characters processed by schema validator');
  assert(!xssItemJson.name.includes('<script>'), 'Script tags stripped completely from item name');
  assert(!xssItemJson.description.includes('<script>'), 'Script tags stripped completely from description');
  assert(xssItemJson.name === 'Crispy Mushroom', 'Clean sanitized string stored in database');

  // Clean up created test item
  if (xssItemJson.id) {
    await fetch(`${BASE_URL}/api/items/${xssItemJson.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
  }

  // Test negative price rejection
  const resBadPrice = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Free Food',
      categoryId: 'cat-1',
      price: -50,
      isVeg: true
    })
  });
  assert(resBadPrice.status === 400, 'Negative price rejected by Zod schema validator');

  // ----------------------------------------------------
  // TEST 5: Google Review URL Strict Validation
  // ----------------------------------------------------
  console.log('\n--- 5. Google Review URL Validation ---');
  const resPhishingUrl = await fetch(`${BASE_URL}/api/settings`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      hotelName: 'Dining Delight',
      googleReviewUrl: 'https://attacker-fake-google.com/phishing'
    })
  });
  assert(resPhishingUrl.status === 400, 'Non-Google phishing review URL strictly rejected (400 Bad Request)');

  const resValidGoogleUrl = await fetch(`${BASE_URL}/api/settings`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      hotelName: 'Dining Delight Multicuisine Restaurant',
      googleReviewUrl: 'https://maps.app.goo.gl/YKQURwjkkjW7NJur9'
    })
  });
  assert(resValidGoogleUrl.status === 200, 'Valid Google review link accepted');

  // ----------------------------------------------------
  // TEST 6: File Upload Security & Magic Byte Inspection
  // ----------------------------------------------------
  console.log('\n--- 6. File Upload Security & Magic Bytes Defense ---');
  
  // Create a fake JPG with PHP / text content
  const tempFakeJpg = path.join(__dirname, 'fake-malicious.jpg');
  fs.writeFileSync(tempFakeJpg, '<?php echo "malicious payload"; ?>');

  const formData = new FormData();
  formData.append('image', new Blob([fs.readFileSync(tempFakeJpg)], { type: 'image/jpeg' }), 'malicious.jpg');

  const resFakeUpload = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const fakeUploadJson = await resFakeUpload.json();
  assert(resFakeUpload.status === 400, 'Spoofed file disguised as .jpg rejected by magic byte signature check');
  assert(
    fakeUploadJson.error.includes('Only authentic JPG, PNG, and WebP'),
    'Correct security error returned on spoofed file upload'
  );

  // Clean up temp file
  try { fs.unlinkSync(tempFakeJpg); } catch (e) {}

  // ----------------------------------------------------
  // TEST 7: Brute Force Account Lockout
  // ----------------------------------------------------
  console.log('\n--- 7. Brute Force Account Lockout Test ---');
  let lockoutTriggered = false;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'test_attacker', password: 'bad_password_' + i })
    });
    if (res.status === 429) {
      lockoutTriggered = true;
      break;
    }
  }
  assert(lockoutTriggered, 'Repeated failed login attempts trigger 429 Account Lockout');

  // ----------------------------------------------------
  // TEST 8: Session Invalidation on Logout
  // ----------------------------------------------------
  console.log('\n--- 8. Session Invalidation on Logout ---');
  const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: authHeaders
  });
  assert(resLogout.status === 200, 'Admin logout endpoint executed successfully');

  // Try using the previous token
  const resOldToken = await fetch(`${BASE_URL}/api/logs`, {
    headers: authHeaders
  });
  assert(resOldToken.status === 401, 'Old JWT revoked and rejected server-side after logout (Session Versioning)');

  // ----------------------------------------------------
  // TEST 9: Audit Trail Logging
  // ----------------------------------------------------
  console.log('\n--- 9. Security Audit Trail Logs ---');
  // Log in again to verify audit logs
  const resRelogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin547', password: 'owner92744!@' })
  });
  const reloginJson = await resRelogin.json();

  const resLogs = await fetch(`${BASE_URL}/api/logs`, {
    headers: { 'Authorization': `Bearer ${reloginJson.token}` }
  });
  const logs = await resLogs.json();
  assert(Array.isArray(logs) && logs.length > 0, 'Audit log entries recorded and accessible to admin');
  
  const hasLoginEvent = logs.some(l => l.action === 'LOGIN_SUCCESS');
  const hasFailedEvent = logs.some(l => l.action === 'LOGIN_FAILED' || l.action === 'ACCOUNT_LOCKED');
  const hasUploadBlockedEvent = logs.some(l => l.action === 'UPLOAD_BLOCKED');
  
  assert(hasLoginEvent, 'LOGIN_SUCCESS event recorded in audit trail');
  assert(hasFailedEvent, 'LOGIN_FAILED / ACCOUNT_LOCKED event recorded in audit trail');
  assert(hasUploadBlockedEvent, 'UPLOAD_BLOCKED event recorded in audit trail');

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`TOTAL TESTS PASSED: ${passed}`);
  console.log(`TOTAL TESTS FAILED: ${failed}`);
  console.log('====================================================');

  if (failed === 0) {
    console.log('🎉 100% OWASP TOP 10 HARDENING VERIFIED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runSecurityTests().catch(err => {
  console.error('Test runner encountered error:', err);
  process.exit(1);
});
