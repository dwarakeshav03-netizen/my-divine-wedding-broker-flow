
// Service for handling authentication with simulation fallback for demo
const API_BASE = '/api/v1/auth';

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthService = {
  // --- EMAIL ---
  sendEmailOtp: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE}/email/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('API Error');
      return response.json();
    } catch (error) {
      console.warn("API unavailable, simulating Email OTP success.");
      await simulateDelay(1000);
      return { success: true, message: 'OTP Sent (Simulated)' };
    }
  },

  verifyEmailOtp: async (email: string, otp: string) => {
    try {
      const response = await fetch(`${API_BASE}/email/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) throw new Error('API Error');
      return response.json();
    } catch (error) {
      console.warn("API unavailable, simulating Email Verify.");
      await simulateDelay(1000);
      // Demo OTP
      if (otp === '123456') return { success: true };
      throw new Error('Invalid OTP (Demo: Use 123456)');
    }
  },

  // --- MOBILE ---
  sendMobileOtp: async (mobile: string, countryCode: string) => {
    try {
        const response = await fetch(`${API_BASE}/mobile/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, countryCode }),
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    } catch (error) {
        console.warn("API unavailable, simulating Mobile OTP success.");
        await simulateDelay(1000);
        return { success: true };
    }
  },

  verifyMobileOtp: async (mobile: string, otp: string) => {
    try {
        const response = await fetch(`${API_BASE}/mobile/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    } catch (error) {
        console.warn("API unavailable, simulating Mobile Verify.");
        await simulateDelay(1000);
        if (otp === '123456') return { success: true };
        throw new Error('Invalid OTP (Demo: Use 123456)');
    }
  },

  // --- AADHAAR ---
  sendAadhaarOtp: async (aadhaar: string) => {
    try {
        const response = await fetch(`${API_BASE}/aadhaar/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadhaar }),
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    } catch (error) {
        console.warn("API unavailable, simulating Aadhaar OTP.");
        await simulateDelay(1500);
        return { success: true };
    }
  },

  verifyAadhaarOtp: async (aadhaar: string, otp: string) => {
    try {
        const response = await fetch(`${API_BASE}/aadhaar/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadhaar, otp }),
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    } catch (error) {
        console.warn("API unavailable, simulating Aadhaar Verify.");
        await simulateDelay(1500);
        if (otp === '123456') return { success: true };
        throw new Error('Invalid Aadhaar OTP (Demo: Use 123456)');
    }
  },

  // --- SOCIAL (Mock) ---
  verifyGoogleToken: async (token: string) => {
    await simulateDelay(1000);
    return { 
        success: true, 
        user: { email: 'google_user@divine.com', name: 'Google User', picture: 'https://ui-avatars.com/api/?name=Google+User&background=random&color=fff' } 
    };
  },

  verifyAppleToken: async (token: string) => {
    await simulateDelay(1000);
    return { 
        success: true, 
        user: { email: 'apple_user@divine.com', name: 'Apple User', picture: 'https://ui-avatars.com/api/?name=Apple+User&background=random&color=fff' } 
    };
  },

  verifyFacebookToken: async (token: string) => {
    await simulateDelay(1000);
    return { 
        success: true, 
        user: { email: 'fb_user@divine.com', name: 'Facebook User', picture: 'https://ui-avatars.com/api/?name=Facebook+User&background=random&color=fff' } 
    };
  }
};
