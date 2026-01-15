import { useEffect } from "react";

useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const [commentsRes, relatedRes] = await Promise.all([
          api.get(`/comments/${slug}`),
          api.get(`/comments/${slug}/related`),
        ]);
        setComments(commentsRes.data);
        setRelatedComments(relatedRes.data);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [slug]);
    if (loading) return <Loading />;
    if (comments.length === 0) {
      return (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#F5F5F3] rounded-full flex items-center justify-center">
                <svg
                    className="w-10 h-10 text-[#9A9A9A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </div>
            <h1 className="text-[24px] font-semibold text-[#2D2D2D] mb-3">Không có bình luận nào</h1>
            <p className="text-[15px] text-[#6B6B6B] mb-8">
                Hiện tại chưa có bình luận nào cho sản phẩm này.
            </p>
        </div>
      );
    }