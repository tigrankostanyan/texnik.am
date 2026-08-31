// Content Moderation & Anti-Bypass Security Engine

export interface ModerationResult {
  passed: boolean;
  violations: string[];
  cleanText: string;
}

export function moderateTextContent(input: string): ModerationResult {
  const violations: string[] = [];
  
  if (!input || !input.trim()) {
    return { passed: true, violations: [], cleanText: input };
  }

  // 1. Phone number patterns (Armenian +374, 0XX XX-XX-XX, spaces, dots, international)
  const phonePattern = /(\+?374[\s\-\.]?\(?[0-9]{2}\)?[\s\-\.]?[0-9]{2}[\s\-\.]?[0-9]{2}[\s\-\.]?[0-9]{2})|(0[1-9]{2}[\s\-\.]?[0-9]{2}[\s\-\.]?[0-9]{2}[\s\-\.]?[0-9]{2})|(\b0[1-9][0-9]{7}\b)|(\b\d{3}[\s\-\.]?\d{2}[\s\-\.]?\d{2}[\s\-\.]?\d{2}\b)|(\+?[0-9]{9,14})/g;
  if (phonePattern.test(input)) {
    violations.push('Հայտնաբերվել է հեռախոսահամար կամ թվային կոնտակտ (արգելված է անձնական տվյալների փոխանցումը)');
  }

  // 2. URLs / Web links
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9_-]+\.(am|com|ru|org|net|me|io|info|biz)\b)/gi;
  if (urlPattern.test(input)) {
    violations.push('Հայտնաբերվել է արտաքին վեբ կայքի հղում (URL)');
  }

  // 3. Social Handles and Messenger patterns (@username, t.me, telegram, viber, whatsapp, instagram, facebook)
  const socialPattern = /(@[a-zA-Z0-9_]{3,})|(t\.me\/[a-zA-Z0-9_]+)|(instagram\.com\/[a-zA-Z0-9_]+)|(fb\.com\/[a-zA-Z0-9_]+)|(wa\.me\/[0-9]+)|(\b(telegram|viber|whatsapp|instagram|տելեգրամ|վայբեր|վացապ|ինստագրամ|ֆեյսբուք)\b)/gi;
  if (socialPattern.test(input)) {
    violations.push('Հայտնաբերվել են սոց․ ցանցերի կամ մեսենջերների հղումներ/@նշումներ');
  }

  // 4. Word-spaced numbers trick detection (e.g. "զրո իննսուն ութ", "0 9 4 1 2 3 4 5 6")
  const spacedDigitsPattern = /\b\d\s+\d\s+\d\s+\d\s+\d\s+\d\s+\d\s+\d\b/;
  if (spacedDigitsPattern.test(input)) {
    violations.push('Հայտնաբերվել է դիտավորյալ բացատներով գրված հեռախոսահամար');
  }

  return {
    passed: violations.length === 0,
    violations,
    cleanText: input.trim(),
  };
}

// Data overlap detection: Check if phone or email is registered in multiple roles
export function checkDataOverlap(
  newPhone: string,
  newEmail: string,
  targetRole: string,
  existingUsers: Array<{ id: string; phone: string; email: string; role: string; fullName: string }>
): { hasOverlap: boolean; conflictingUser?: { id: string; fullName: string; role: string } } {
  const normPhone = newPhone.replace(/[\s\-\(\)\+]/g, '');
  const normEmail = newEmail.trim().toLowerCase();

  for (const user of existingUsers) {
    if (user.role !== targetRole) {
      const userPhone = user.phone.replace(/[\s\-\(\)\+]/g, '');
      const userEmail = user.email.trim().toLowerCase();

      if ((normPhone && userPhone && (normPhone.endsWith(userPhone) || userPhone.endsWith(normPhone))) ||
          (normEmail && userEmail && normEmail === userEmail)) {
        return {
          hasOverlap: true,
          conflictingUser: {
            id: user.id,
            fullName: user.fullName,
            role: user.role,
          },
        };
      }
    }
  }

  return { hasOverlap: false };
}

// Generate device fingerprint
export function getOrCreateDeviceFingerprint(): string {
  let devId = localStorage.getItem('varpet_device_id');
  if (!devId) {
    const randomBytes = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    devId = `dev_${randomBytes}`;
    localStorage.setItem('varpet_device_id', devId);
  }
  return devId;
}

export function getDeviceName(): string {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android Device (PWA)';
  if (/iPad|iPhone|iPod/.test(ua)) return 'Apple iPhone/iPad (PWA)';
  if (/Macintosh/i.test(ua)) return 'Apple MacBook (Chrome/Safari)';
  if (/Windows/i.test(ua)) return 'Windows Desktop (Web)';
  if (/Linux/i.test(ua)) return 'Linux Workstation';
  return 'Web Browser Device';
}
