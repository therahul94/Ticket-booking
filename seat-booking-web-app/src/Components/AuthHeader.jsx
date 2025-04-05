import { Link } from 'react-router-dom'


const AuthHeader = ({ subheading, subHeadlink, subHead }) => {
    return (
        <div>
            <div className="text-center">
                <div className="font-extrabold text-3xl text-blue-600">
                    Ticket Booking
                </div>
                <div className="text-gray-600 text-sm">
                    <div>
                        {subheading} <Link to={subHeadlink} className="underline hover:text-blue-600">{subHead}</Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthHeader
