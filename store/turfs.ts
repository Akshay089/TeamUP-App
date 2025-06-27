const turfs=[

  {
    id: 1,
    name: 'Green Valley Turf',
    location: '123 Sports Complex, City',
    price: '₹800/hour',
    rating: 4.5,
    image: 'https://media.istockphoto.com/id/520999573/photo/indoor-soccer-football-field.jpg?s=612x612&w=0&k=20&c=X2PinGm51YPcqCAFCqDh7GvJxoG2WnJ19aadfRYk2dI=',
    amenities: ['Parking', 'Showers', 'Lighting'],
  },
  {
    id: 2,
    name: 'Sports Hub Turf',
    location: '456 Athletic Park, City',
    price: '₹1000/hour',
    rating: 4.8,
    image: 'https://www.dlws.edu.in/blog/images/cricket.png',
    amenities: ['Parking', 'Café', 'Lockers'],
  },
  {
    id: 3,
    name: 'Elite Sports Turf',
    location: '789 Recreation Center, City',
    price: '₹1200/hour',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Showers', 'Pro Shop'],
  },
  {
    id: 4,
    name: 'Green Valley Turf',
    location: '123 Sports Complex, City',
    price: '₹800/hour',
    rating: 4.5,
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/5/310775853/NC/MR/SI/5974440/multi-sport-turf-500x500.png',
    amenities: ['Parking', 'Showers', 'Lighting'],
  },
  {
    id: 5,
    name: 'Sports Hub Turf',
    location: '456 Athletic Park, City',
    price: '₹1000/hour',
    rating: 4.8,
    image: 'https://www.dlws.edu.in/blog/images/cricket.png',
    amenities: ['Parking', 'Café', 'Lockers'],
  },
  {
    id: 6,
    name: 'Elite Sports Turf',
    location: '789 Recreation Center, City',
    price: '₹1200/hour',
    rating: 4.7,
    image: 'https://media.vrbo.com/lodging/98000000/97090000/97084000/97083984/f57846a2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
    amenities: ['Parking', 'Showers', 'Pro Shop'],
  },
];

const carouselImages = [
  {
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg",
    ],
    res_id: "/turfs/turf_1",
  },
  {
    images: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
      "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg",
      "https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg",
    ],
    res_id: "/turfs/turf_2",
  },
  {
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
      "https://images.pexels.com/photos/15638789/pexels-photo-15638789.jpeg",
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg",
    ],
    res_id: "/turfs/turf_3",
  },
  {
    images: [
      "https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg",
      "https://images.pexels.com/photos/1819669/pexels-photo-1819669.jpeg",
      "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
    ],
    res_id: "/turfs/turf_4",
  },
  {
    images: [
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
    ],
    res_id: "/turfs/turf_5",
  },
  {
    images: [
      "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg",
      "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg",
    ],
    res_id: "/turfs/turf_6",
  },
];

const slots = [
  {
    ref_id: "/turfs/turf_1",
    slot: ["11:30", "13:30", "15:30", "17:30", "19:30", "21:30"],
  },
  {
    ref_id: "/turfs/turf_2",
    slot: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  },
  {
    ref_id: "/turfs/turf_3",
    slot: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"],
  },
  {
    ref_id: "/turfs/turf_4",
    slot: [
      "09:00",
      "11:00",
      "13:00",
      "15:00",
      "17:00",
      "19:00",
      "21:00",
      "23:00",
    ],
  },
  {
    ref_id: "/turfs/turf_5",
    slot: ["10:30", "12:30", "14:30", "16:30", "18:30", "20:30"],
  },
  {
    ref_id: "/turfs/turf_6",
    slot: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
  },
  {
    ref_id: "/turfs/turf_7",
    slot: ["08:30", "10:30", "12:30", "14:30", "16:30", "18:30", "20:30"],
  },
];
export { carouselImages, slots, turfs };

