import React from 'react';
import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
import { toast } from "react-toastify";
import { SiHotelsdotcom } from 'react-icons/si';
import config from '../config';

const BookingPage = () => {
    const location = useLocation();
    const bookdata = location.state?.payload;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhoneNo] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardHolderName, setCardHolderName] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCvv] = useState("")
    const [upiId, setUpiId] = useState("")
    const [bankName, setBankName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [ifscCode, setIfscCode] = useState("")
    const [paymentLoading, setPaymentLoading] = useState(false)

    const navigate = useNavigate();
    
    // Use optional chaining and provide default values
    const checkIn = bookdata?.checkInDate ? new Date(bookdata.checkInDate) : new Date();
    const checkOut = bookdata?.checkOutDate ? new Date(bookdata.checkOutDate) : new Date();
    const stayDuration = Math.max(1, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const baseCost = stayDuration * (bookdata?.pricePerNight || 0) * (bookdata?.requiredRooms || 1);

    const gst = baseCost * 0.18;
    const totalCost = baseCost + gst;

    const {id} = useParams();

    const handleBooking = async (event) => {
        event.preventDefault();
        if (!bookdata) {
            setError("Booking data is missing. Please try again.");
            return;
        }
        
        // Validate form fields
        if (!firstName || !lastName || !email || !phone) {
            setError("Please fill in all required fields.");
            return;
        }

        setShowPaymentForm(true);
    };

    const handlePayment = async () => {
        // Validate based on payment method
        let isValid = true;
        let errorMessage = "";

        switch (paymentMethod) {
            case "credit_card":
            case "debit_card":
                if (!cardNumber || !cardHolderName || !expiryDate || !cvv) {
                    isValid = false;
                    errorMessage = "Please fill in all card details.";
                }
                break;
            case "upi":
                if (!upiId) {
                    isValid = false;
                    errorMessage = "Please enter UPI ID.";
                }
                break;
            case "net_banking":
                if (!bankName || !accountNumber || !ifscCode) {
                    isValid = false;
                    errorMessage = "Please fill in all net banking details.";
                }
                break;
            default:
                isValid = false;
                errorMessage = "Please select a payment method.";
        }

        if (!isValid) {
            setError(errorMessage);
            return;
        }

        setPaymentLoading(true);
        setError(null);

        const payload = { 
            firstName, 
            lastName, 
            email, 
            phone, 
            checkInDate: bookdata.checkInDate, 
            checkOutDate: bookdata.checkOutDate, 
            roomCount: bookdata.requiredRooms, 
            totalCost,
            paymentMethod,
            hotelName: bookdata.hotelName,
            pricePerNight: bookdata.pricePerNight,
            gst,
            baseCost,
            stayDuration
        };

        // Add payment details based on method
        if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
            payload.cardNumber = cardNumber.slice(-4);
            payload.cardHolderName = cardHolderName;
        } else if (paymentMethod === "upi") {
            payload.upiId = upiId;
        } else if (paymentMethod === "net_banking") {
            payload.bankName = bankName;
            payload.accountNumber = accountNumber.slice(-4); // Only last 4 digits
        }

        try {
            const token = Cookies.get('token');
            const response = await fetch(`https://stayeazy.onrender.com/api/v1/hotels/${id}/confirm-booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to confirm booking');
            }

            const data = await response.json();
            toast.success("Booking successful! Check your email for confirmation.");
            console.log('Booking confirmed:', data.data);
            navigate(`/hotel/${id}`);
        } catch (err) {
            setError(err.message);
            console.error('Error confirming booking:', err);
        } finally {
            setPaymentLoading(false);
        }
    };

    const goBackToForm = () => {
        setShowPaymentForm(false);
        setError(null);
        // Reset payment fields
        setPaymentMethod("");
        setCardNumber("");
        setCardHolderName("");
        setExpiryDate("");
        setCvv("");
        setUpiId("");
        setBankName("");
        setAccountNumber("");
        setIfscCode("");
    };

    const renderPaymentFields = () => {
        switch (paymentMethod) {
            case "credit_card":
            case "debit_card":
                return (
                    <>
                        <div>
                            <label className="text-xs font-medium">Card Number</label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                maxLength="19"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Card Holder Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={cardHolderName}
                                onChange={(e) => setCardHolderName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    maxLength="5"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium">CVV</label>
                                <input
                                    type="password"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    maxLength="3"
                                />
                            </div>
                        </div>
                    </>
                );
            case "upi":
                return (
                    <div>
                        <label className="text-xs font-medium">UPI ID</label>
                        <input
                            type="text"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                );
            case "net_banking":
                return (
                    <>
                        <div>
                            <label className="text-xs font-medium">Bank Name</label>
                            <select
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            >
                                <option value="">Select Bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="pnb">Punjab National Bank</option>
                                <option value="canara">Canara Bank</option>
                                <option value="union">Union Bank of India</option>
                                <option value="bank_of_baroda">Bank of Baroda</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium">Account Number</label>
                            <input
                                type="text"
                                placeholder="Enter account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">IFSC Code</label>
                            <input
                                type="text"
                                placeholder="Enter IFSC code"
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!bookdata) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl text-red-500">Error: Booking data is missing. Please go back and try again.</p>
        </div>;
    }

    if (showPaymentForm) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-lg p-3">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                            <SiHotelsdotcom className={`text-2xl text-blue-600`} />
                            <span className={`text-2xl font-bold text-blue-600`}>
                                stayEazy
                            </span>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row justify-center p-4 lg:p-10 space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="lg:w-2/3 xl:w-1/2 bg-white p-5 shadow-lg rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Payment Details</h2>
                            <button 
                                onClick={goBackToForm}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                ← Back to Form
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="net_banking">Net Banking</option>
                                </select>
                            </div>

                            {renderPaymentFields()}
                        </div>
                    </div>

                    <div className="lg:w-1/3 xl:w-1/4 bg-white p-5 shadow-lg rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">{bookdata.hotelName}</h2>
                            <span className="text-xs bg-blue-500 text-white rounded-md px-1 py-0.5">NEW</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{`${stayDuration} - Night${stayDuration > 1 ? 's' : ''}`}</p>
                        <div className="flex items-center mb-3">
                            <span className="text-xs text-gray-500">{`${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`}</span>
                            <span className="mx-1">|</span>
                            <span className="text-xs text-gray-500">{`${bookdata.requiredRooms} - Room${bookdata.requiredRooms > 1 ? 's' : ''}`}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mb-3">
                            <h3 className="text-base font-semibold mb-1">Classic</h3>
                            <div className="text-xs text-gray-500 flex justify-between mb-1">
                                <span>Room price</span>
                                <span>{`₹${baseCost.toFixed(2)}`}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex justify-between mb-1">
                                <span>18% GST</span>
                                <span>{`₹${gst.toFixed(2)}`}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex justify-between mb-1">
                                <span>Instant discount</span>
                                <span>-₹0.00</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                            <span className="text-base font-semibold">Payable Amount</span>
                            <span className="text-base font-semibold">{`₹${totalCost.toFixed(2)}`}</span>
                        </div>

                        <button 
                            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm" 
                            onClick={handlePayment}
                            disabled={paymentLoading}
                        >
                            {paymentLoading ? 'Processing Payment...' : 'Pay Now'}
                        </button>
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-lg p-3">
                <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <SiHotelsdotcom className={`text-2xl text-blue-600`} />
                    <span className={`text-2xl font-bold text-blue-600`}>
                    stayEazy
                    </span>
                </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row justify-center p-4 lg:p-10 space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="lg:w-2/3 xl:w-1/2 bg-white p-5 shadow-lg rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Enter your details</h2>
                    <p className="text-xs text-gray-600 mb-4">
                        We will use these details to share your booking information
                    </p>

                    <form className="space-y-3">
                        <div>
                            <label className="text-xs font-medium">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Check-In-Date</label>
                            <input
                                type="date"
                                value={bookdata.checkInDate}
                                readOnly
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Check-Out-Date</label>
                            <input
                                type="date"
                                value={bookdata.checkOutDate}
                                readOnly
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Rooms</label>
                            <input
                                type="text"
                                value={bookdata.requiredRooms}
                                readOnly
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@abc.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Mobile Number</label>
                            <div className="flex">
                                <span className="p-2 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">+91</span>
                                <input
                                    type="text"
                                    placeholder="e.g. 1234567890"
                                    value={phone}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-r-lg focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="lg:w-1/3 xl:w-1/4 bg-white p-5 shadow-lg rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold">{bookdata.hotelName}</h2>
                        <span className="text-xs bg-blue-500 text-white rounded-md px-1 py-0.5">NEW</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{`${stayDuration} - Night${stayDuration > 1 ? 's' : ''}`}</p>
                    <div className="flex items-center mb-3">
                        <span className="text-xs text-gray-500">{`${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`}</span>
                        <span className="mx-1">|</span>
                        <span className="text-xs text-gray-500">{`${bookdata.requiredRooms} - Room${bookdata.requiredRooms > 1 ? 's' : ''}`}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mb-3">
                        <h3 className="text-base font-semibold mb-1">Classic</h3>
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>Room price</span>
                            <span>{`₹${baseCost.toFixed(2)}`}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>18% GST</span>
                            <span>{`₹${gst.toFixed(2)}`}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>Instant discount</span>
                            <span>-₹0.00</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                        <span className="text-base font-semibold">Payable Amount</span>
                        <span className="text-base font-semibold">{`₹${totalCost.toFixed(2)}`}</span>
                    </div>

                    <button 
                        className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm" 
                        onClick={handleBooking}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Book Now'}
                    </button>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;