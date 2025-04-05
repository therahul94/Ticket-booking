const AuthButton = ({buttonVal, onClick}) => {
  return (
    <div className="h-full flex flex-col justify-end">
      <button type="button" onClick={onClick} className="text-white w-full bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{buttonVal}</button>
      </div>
  )
}

export default AuthButton
