import React from 'react'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

const FeaturesSection = () => {
  return (
    <section className='py-16 px-4 bg-white'>
      <div className='conatiner mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
        {/* Feature 1 */}
        <div className='flex flex-col items-center'>
          <div className='p-4 rounded-full'>
            <HiShoppingBag />
          </div>
          <h4 className='tracking-tighter mb-2 uppercase'>Free International Shipping</h4>
          <p className='text-gray-600 text-sm tracking tracking-tighter'> On all orders over $100</p>
        </div>
        {/* Feature 2 */}
        <div className='flex flex-col items-center'>
          <div className='p-4 rounded-full'>
            <HiArrowPathRoundedSquare />
          </div>
          <h4 className='tracking-tighter mb-2 uppercase'>45 days return</h4>
          <p className='text-gray-600 text-sm tracking tracking-tighter'>Money back gaurantee</p>
        </div>
       {/* Feature 3 */}
        <div className='flex flex-col items-center'>
          <div className='p-4 rounded-full'>
            <HiOutlineCreditCard />
          </div>
          <h4 className='tracking-tighter mb-2 uppercase'>Secure payment</h4>
          <p className='text-gray-600 text-sm tracking tracking-tighter'>100% secure payment</p>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection