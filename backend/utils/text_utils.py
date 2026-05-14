import re

def count_readable_words(html_content: str) -> int:
    """
    统计富文本内容中的实际阅读字数。
    1. 移除 HTML 标签
    2. 移除多余空白字符
    3. 统计中文字符和英文单词
    """
    if not html_content:
        return 0
    
    # 移除 HTML 标签
    text = re.sub(r'<[^>]+>', '', html_content)
    
    # 移除转义字符如 &nbsp;
    text = re.sub(r'&[a-z]+;', ' ', text)
    
    # 统计字数：
    # 中文：每个汉字计为一个字
    # 英文：每个连续的单词计为一个字
    
    # 匹配中文字符
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)
    # 匹配英文单词
    english_words = re.findall(r'[a-zA-Z0-9]+', text)
    
    return len(chinese_chars) + len(english_words)
