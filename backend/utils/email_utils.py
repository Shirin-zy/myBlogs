import requests
import random
import os
from dotenv import load_dotenv

load_dotenv()

def generate_verification_code(length=6):
    """生成指定长度的数字验证码"""
    return ''.join(random.choices('0123456789', k=length))

def get_email_content(random_code):
    """生成邮件HTML内容"""
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>验证码</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }}
        .email-container {{
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }}
        .header h1 {{
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }}
        .header p {{
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
        }}
        .content {{
            padding: 40px 30px;
            text-align: center;
        }}
        .greeting {{
            color: #333333;
            font-size: 18px;
            margin-bottom: 20px;
        }}
        .message {{
            color: #666666;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
        }}
        .code-box {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            padding: 20px 30px;
            display: inline-block;
            margin: 20px 0;
            max-width: 100%;
            box-sizing: border-box;
        }}
        .code {{
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 6px;
            font-family: 'Courier New', Courier, monospace;
            word-break: break-all;
        }}
        .note {{
            color: #999999;
            font-size: 13px;
            margin-top: 30px;
            line-height: 1.6;
        }}
        .footer {{
            background-color: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }}
        .footer p {{
            color: #999999;
            font-size: 12px;
            line-height: 1.8;
        }}
        @media screen and (max-width: 600px) {{
            body {{
                padding: 10px;
            }}
            .header {{
                padding: 30px 20px;
            }}
            .header h1 {{
                font-size: 20px;
            }}
            .content {{
                padding: 30px 20px;
            }}
            .code-box {{
                padding: 15px 20px;
            }}
            .code {{
                font-size: 24px;
                letter-spacing: 4px;
            }}
        }}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>验证码</h1>
            <p>Verification Code</p>
        </div>
        <div class="content">
            <p class="greeting">尊敬的用户，您好！</p>
            <p class="message">您正在进行验证操作，请使用以下验证码完成验证。</p>
            <div class="code-box">
                <div class="code">{random_code}</div>
            </div>
            <p class="note">
                验证码有效期为 5 分钟，请尽快使用。<br>
                如非本人操作，请忽略此邮件。
            </p>
        </div>
        <div class="footer">
            <p>
                此邮件由系统自动发送，请勿直接回复。<br>
                如有疑问，请联系客服。
            </p>
        </div>
    </div>
</body>
</html>
"""

base_url = "https://luckycola.com.cn/tools/customMail"

def send_verification_email(to_email: str, verification_code: str):
    """发送验证码邮件"""
    email_data = {
        "ColaKey": os.getenv("EMAIL_COLA_KEY", "U5VJShXOR2Wd9f1781659391066z6oDWcNQD4"),
        "tomail": to_email,
        "fromTitle": "动态验证码",
        "subject": "这是您的动态验证码",
        "smtpCode": os.getenv("EMAIL_SMTP_CODE", "afhrhewdktqtcdfj"),
        "smtpEmail": os.getenv("EMAIL_SMTP_EMAIL", "1820207034@qq.com"),
        "smtpCodeType": "qq",
        "isTextContent": False,
        "content": get_email_content(verification_code),
    }
    
    try:
        response = requests.post(base_url, json=email_data, timeout=10)
        response.raise_for_status()
        result = response.json()
        return result
    except requests.exceptions.RequestException as e:
        print(f"邮件发送失败: {e}")
        return None
