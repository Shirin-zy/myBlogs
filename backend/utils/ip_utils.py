import httpx
import asyncio


async def get_ip_location(ip: str) -> str:
    """
    通过 IP 地址获取地理位置
    使用免费的 ip-api.com 服务
    """
    if not ip or ip in ["127.0.0.1", "localhost", "::1"]:
        return "本地"

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"http://ip-api.com/json/{ip}")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    country = data.get("country", "")
                    region = data.get("regionName", "")
                    city = data.get("city", "")
                    # 组合地理位置信息
                    location_parts = []
                    if country:
                        location_parts.append(country)
                    if region and region != country:
                        location_parts.append(region)
                    if city and city != region:
                        location_parts.append(city)
                    return " ".join(location_parts) if location_parts else "未知"
    except Exception as e:
        print(f"获取 IP 地理位置失败: {e}")
    
    return "未知"
