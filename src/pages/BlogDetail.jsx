import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'

const BlogDetail = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`)
        setBlog(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [slug])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  if (loading) return <Loading />
  if (!blog) return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[#6B6B6B]">Không tìm thấy bài viết</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <nav className="flex items-center gap-2 text-[14px] mb-8">
        <Link to="/" className="text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors">Trang chủ</Link>
        <svg className="w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/tin-tuc" className="text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors">Tin tức</Link>
        <svg className="w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#2D2D2D] font-medium truncate max-w-[200px]">{blog.title}</span>
      </nav>

      <article className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        )}
        <div className="p-6 md:p-10">
          <h1 className="text-[26px] md:text-[32px] font-semibold text-[#2D2D2D] leading-tight mb-5">{blog.title}</h1>
          <div className="flex items-center gap-3 text-[14px] text-[#9A9A9A] mb-8 pb-8 border-b border-[#EBEBEB]">
            <div className="w-10 h-10 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[#2D2D2D] font-medium">{blog.author?.fullName || 'Admin'}</p>
              <p className="text-[13px]">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          <div className="text-[15px] text-[#6B6B6B] leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>
        </div>
      </article>

      <div className="mt-8 text-center">
        <Link
          to="/tin-tuc"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#7C9A82] hover:text-[#6B8A71] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại danh sách tin tức
        </Link>
      </div>
    </div>
  )
}

export default BlogDetail
