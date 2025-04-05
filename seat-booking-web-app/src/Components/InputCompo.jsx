
const InputCompo = ({label, type,placeholder, onChange}) => {
  return (
    <div>
        <label className="block text-sm font-medium text-blue-600">{label}</label>
        <input onChange={onChange} type={type || "text"} 
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder={placeholder} 
            required 
        />
    </div>
  )
}

export default InputCompo
