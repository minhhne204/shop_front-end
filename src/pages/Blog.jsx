import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs')
        setBlogs(res.data.blogs)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Tin tức</h1>
        <p className="text-[15px] text-[#6B6B6B]">Cập nhật những tin tức mới nhất về mô hình</p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBEBEB]">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-[#6B6B6B]">Chưa có bài viết nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/tin-tuc/${blog.slug}`} className="group block">
              <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover-lift">
                {blog.thumbnail ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-[#F5F5F3] flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-[16px] font-medium text-[#2D2D2D] group-hover:text-[#7C9A82] transition-colors line-clamp-2 mb-3">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[13px] text-[#9A9A9A]">
                    <span>{blog.author?.fullName || 'Admin'}</span>
                    <span className="w-1 h-1 rounded-full bg-[#9A9A9A]" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Blog
