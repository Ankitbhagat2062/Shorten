import { AnalyticsIcon, ChartIcon, ClockIcon, DashboardIcon, DeviceIcon, GlobeIcon, HomeIcon, LinkIcon, ProfileIcon, SettingsIcon } from "./icons";

export const navItems = [
    { id: '', label: 'Home', icon: HomeIcon },
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const dateRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
];

export const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartIcon },
    { id: 'geography', label: 'Geography', icon: GlobeIcon },
    { id: 'devices', label: 'Devices', icon: DeviceIcon },
    { id: 'referrers', label: 'Referrers', icon: LinkIcon },
    { id: 'timeline', label: 'Timeline', icon: ClockIcon },
];

export const timelineViews = [
    { id: 'hourly', label: 'Hourly' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
];

export const html = (otp, toEmail) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 40px; border-radius: 16px 16px 0 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo Icon -->
                                        <img src="https://cdn-icons-png.flaticon.com/512/1256/1256682.png" alt="Shorten Logo" width="48" height="48" style="display: inline-block; margin-bottom: 12px;">
                                        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Shorten</h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Greeting -->
                            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: center;">Verify Your Email</h2>
                            
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #525252; text-align: center;">
                                Welcome to <strong style="color: #667eea;">Shorten</strong>! Use the verification code below to complete your ${otp ? 'login' : 'signup'} process.
                            </p>

                            <!-- OTP Code Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; display: inline-block; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.backgroundColor='#eef2ff';this.style.borderColor='#764ba2';this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)';document.getElementById('copyBtn').innerText='Click to copy'" onmouseout="this.style.backgroundColor='#f8fafc';this.style.borderColor='#667eea';this.style.boxShadow='none';document.getElementById('copyBtn').innerText='Click to copy'" onclick="navigator.clipboard.writeText('${otp}'); document.getElementById('copyBtn').innerText='✓ Copied!';">
                                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                            <button type='button' style="margin: 0; border: 2px dashed #667eea; font-size: 36px; font-weight: 800; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; user-select: all; cursor: pointer; background: transparent; border: none;">
                                                ${otp}
                                            </button>
                                            <p style="margin: 12px 0 0 0; font-size: 12px; color: #667eea; transition: color 0.3s ease;" id="copyBtn">Click to copy</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expiry Warning -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px 16px; display: inline-block;">
                                            <p style="margin: 0; font-size: 14px; color: #92400e; display: flex; align-items: center; gap: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                This code expires in <strong>10 minutes</strong>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="background-color: #f4f4f5; border-radius: 8px; padding: 16px;">
                                        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">
                                            🔒 Security Notice
                                        </p>
                                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #525252;">
                                            If you didn't request this code, please ignore this email. Never share your verification code with anyone.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #fafafa; padding: 24px 40px; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #525252;">
                                            Having trouble? Contact our support team at
                                            <a href="mailto:support@shorten.com" style="color: #667eea; text-decoration: none;">support@shorten.com</a>
                                        </p>
                                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                            © ${new Date().getFullYear()} Shorten. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Mobile-friendly note -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; margin-top: 24px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                This email was sent to <span style="color: #667eea;">${toEmail}</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
