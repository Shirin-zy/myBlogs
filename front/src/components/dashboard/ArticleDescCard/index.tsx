import React, { useState, useRef } from "react"
import { Upload, X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { http } from "@/lib/http"
import styles from "./index.module.less"

interface ArticleDescCardProps {
  initialData?: {
    bgPicture?: string
    category?: string
    tags?: string[]
  }
  onDataChange?: (data: { bgPicture: string; category: string; tags: string[] }) => void
}

const CATEGORIES = ["前端技术", "后端开发", "人工智能", "开发工具", "日常随笔", "热门"]

const ArticleDescCard: React.FC<ArticleDescCardProps> = ({ initialData, onDataChange }) => {
  const { toast } = useToast()
  const [bgPicture, setBgPicture] = useState(initialData?.bgPicture || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 校验文件类型
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: "请选择图片文件",
      })
      return
    }

    // 这里可以接入真实的上传接口，目前先转为 base64 预览
    const formData = new FormData()
    formData.append("file", file)
    try {
      const result = await http.post<{ url: string; message: string }>("/upload/image", formData)
      if (result.url) {
        setBgPicture(result.url)
        onDataChange?.({ bgPicture: result.url, category, tags })
      } else {
        toast({
          variant: "destructive",
          title: "上传失败",
          description: result.message || "请检查图片格式",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: "网络错误或服务器异常",
      })
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setCategory(value)
    onDataChange?.({ bgPicture, category: value, tags })
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag]
      setTags(newTags)
      setTagInput("")
      onDataChange?.({ bgPicture, category, tags: newTags })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove)
    setTags(newTags)
    onDataChange?.({ bgPicture, category, tags: newTags })
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Card className={styles.descCard}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">文章设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 封面上传 */}
        <div className="space-y-2">
          <Label>文章封面</Label>
          <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
            {bgPicture ? (
              <div className={styles.previewWrapper}>
                <img src={bgPicture} alt="Cover Preview" className={styles.previewImage} />
                <div className={styles.uploadOverlay}>
                  <Upload className="h-6 w-6 text-white" />
                  <span className="text-white text-xs mt-1">更换图片</span>
                </div>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mt-2">点击上传封面图</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>

        {/* 分类选择 */}
        <div className="space-y-2">
          <Label>文章分类</Label>
          <select className={styles.selectInput} value={category} onChange={handleCategoryChange}>
            <option value="" disabled>
              请选择分类
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 标签管理 */}
        <div className="space-y-2">
          <Label>文章标签</Label>
          <div className="flex gap-2">
            <Input
              placeholder="输入标签后按回车"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <Button variant="outline" size="icon" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveTag(tag)} />
              </Badge>
            ))}
            {tags.length === 0 && <span className="text-xs text-muted-foreground italic">暂无标签</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ArticleDescCard
