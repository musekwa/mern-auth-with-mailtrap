
import { Check, X } from 'lucide-react'
import React from 'react'

const PasswordCriteria = ({password})=>{
    // const criteria = [
    //     {regex: /[a-z]/, message: "Must contain a lowercase letter"},
    //     {regex: /[A-Z]/, message: "Must contain an uppercase letter"},
    //     {regex: /[0-9]/, message: "Must contain a number"},
    //     {regex: /[!@#$%^&*]/, message: "Must contain a special character"},
    //     {regex: /.{8,}/, message: "Must be at least 8 characters long"},
    // ]
    const criteria = [
        {label: "At least 6 characters", met: password.length >= 6},
        {label: "At least 1 uppercase letter", met: /[A-Z]/.test(password)},
        {label: "At least 1 lowercase letter", met: /[a-z]/.test(password)},
        {label: "At least 1 number", met: /\d/.test(password)},
        {label: "At least 1 special character", met: /[^a-zA-Z0-9]/.test(password)},
    ]

    return (
      <div className="mt-2 space-y-1">
        {
          criteria.map((item)=>(
            <div key={item.label} className={`flex items-center text-xs`}>
             {
              item.met ? (
                <Check className="size-4 text-green-500 mr-2" />
              ) : (
                <X className="size-4 text-gray-500 mr-2" />
              )
             }
             <span className={`text-xs ${item.met ? "text-green-500" : "text-gray-400"}`}>
                {item.label}
             </span>
            </div>
          ))
        }
      </div>
    )

}

const PasswordStrengthMeter = ({password}) => {
  const getStrength = (password)=>{
    let strength = 0
    if(password.length >= 6) strength += 1
    if(/[A-Z]/.test(password)) strength += 1
    if(/[a-z]/.test(password)) strength += 1
    if(/\d/.test(password)) strength += 1
    if(/[^a-zA-Z0-9]/.test(password)) strength += 1
    return strength
  }
  const strength = getStrength(password)

  const getStrengthText = (strength)=>{
    if(strength === 0) return "Very Weak"
    if(strength === 1) return "Weak"
    if(strength === 2) return "Fair"
    if(strength === 3) return "Good"
    if(strength === 4) return "Strong"
  }

  const getStrengthColor = (strength)=>{
    if(strength === 0) return "bg-red-500"
    if(strength === 1) return "bg-red-400"
    if(strength === 2) return "bg-yellow-400"
    if(strength === 3) return "bg-green-400"
    if(strength === 4) return "bg-green-500"
  }
  return (
    <div className="mt-2">

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">Password Strength</span>
        <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
      </div>
      <div className="flex space-x-1 ">
        {
          [...Array(4)].map((_, index)=>(
            <div key={index} className={`h-1 w-1/4 rounded-full transition-colors duration-300  ${index < strength ? getStrengthColor(strength) : "bg-gray-600"}`}>

            </div>
          ))
        }
      </div>
      <PasswordCriteria password={password} />
    </div>
  )
}

export default PasswordStrengthMeter