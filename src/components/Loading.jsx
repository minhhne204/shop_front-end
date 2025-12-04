const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="w-12 h-12 border-[3px] border-[#EBEBEB] rounded-full"></div>
        <div className="absolute inset-0 w-12 h-12 border-[3px] border-transparent border-t-[#7C9A82] rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default Loading
