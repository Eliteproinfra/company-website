export type Review = {
  name: string;
  /** Relative age as shown on the Google listing, e.g. "6 months ago". */
  time: string;
  quote: string;
  verified: boolean;
};

export const googleRating = { score: 5.0, count: 119 };

// The full Google review wall from the live homepage, newest first.
export const reviews: Review[] = [
  { name: "Reenu Singh", time: "6 months ago", quote: "Had a great experience dealing with Mr. Pawan at ElitePro Infra while purchasing my home at Silverglades. He made sure every detail was explained clearly and helped me get the best deal without any stress.", verified: true },
  { name: "Baby Yadav", time: "6 months ago", quote: "Elite Pro is the most trustworthy real estate advisor in Gurgaon. Mr. Viren Mehta helped me in my investment in DLF. The team is very supportive and professional.", verified: true },
  { name: "Manisha Ghosh", time: "9 months ago", quote: "Most Transparent Real Estate Company. Humble and honest people.", verified: true },
  { name: "Shantanu Kumar", time: "9 months ago", quote: "I had an excellent experience working with ElitePro Infra. The team was professional, knowledgeable, and incredibly responsive throughout the entire process. They guided me step by step, whether it was scheduling viewings, answering my questions, or helping with paperwork. Their market expertise and dedication made buying/selling a property stress-free and enjoyable. I highly recommend them to anyone looking for a reliable and trustworthy real estate partner. So when you purchase property in Gurgaon, ElitePro Infra is the best real estate.", verified: true },
  { name: "Shashank Aggarwal", time: "A Year ago", quote: "When it is about buying a property in Gurgaon, it’s always been Elite Pro for me. I have done two deals with Pawan from ElitePro; I must say the dealing has been very transparent and professionally driven. I would strongly recommend the team for their knowledge, guidance, and operational excellence.", verified: true },
  { name: "Piyush Sharma", time: "A Year ago", quote: "I have been in contact with Elite Pro for my real estate dealings for 4 years. Pawan from ElitePro helped in investing in the most promising projects in Gurgaon. Pawan has been instrumental in making the refund process also super smooth for me. Usually the refund and cancellation process with builders is very complicated and time-consuming, but the ElitePro team ensured that everything was done on time and without any hassle. I am very thankful to the team ElitePro for their constant support.", verified: true },
  { name: "Rohit Singh", time: "9 months ago", quote: "Elite Pro Infra Trusted For Transparency The name is Enough for Buying a Property in Delhi NCR. For me, it's always Elite Pro for my real estate solutions, whether it's buying or selling. I Have Being in Touch With Ravi Gaba From Elite Pro. The way of dealing has been very transparent and professionally done. I Highly Recommend Them for their Knowledge and guidance.", verified: true },
  { name: "Nidhi Rana", time: "A Year ago", quote: "An outstanding real estate firm with a highly professional and dedicated team. I had an excellent experience working with them and would definitely recommend their services.", verified: true },
  { name: "Chhavi Raghav", time: "A Year ago", quote: "I can genuinely say that Elite pro helped me making a right buying decision. I wholeheartedly recommend their services to anyone seeking to enhance their financial well-being and embrace a luxurious lifestyle.", verified: true },
  { name: "Dalbir Raghav", time: "A Year ago", quote: "Exceptional work knowledge; I purchased residential from Elite. I am very happy from sales and after-sales work Thank you", verified: true },
  { name: "Rubina Narula", time: "A Year ago", quote: "Professional and supportive consultancy firm. Experienced real estate professionals. Much recommended!", verified: true },
  { name: "Aman Yadav", time: "3 years ago", quote: "Elite Pro is the best real estate company I have ever dealt with. Very professional, experienced, and helpful. Highly recommend.", verified: true },
  { name: "Suleman Ahmed", time: "9 months ago", quote: "Elite pro is the best real Realestate consulting brand of Gurgaon.", verified: true },
  { name: "Kartik", time: "3 years ago", quote: "Wonderful experience with Elite Pro Infra. I'm impressed with their services had a great experience. I will definitely refer this company to anyone who’s looking for any property", verified: true },
  { name: "Ajay Malik", time: "A Year ago", quote: "Very hard-working company with nice and professional employees. Best real estate firm in Gurugram.", verified: true },
  { name: "Ajay S.", time: "2 years ago", quote: "I had never seen before this kind of real estate & consultancy firm. The entire team of ELITEPRO is very cooperative & very helpful in nature.", verified: true },
  { name: "Pankaj Kumar", time: "3 years ago", quote: "Got the appropriate advice and a great deal from the Team Elite pro. Will love to deal with them again.", verified: true },
  { name: "Sangeeta Bhatt", time: "3 years ago", quote: "Had a great experience purchasing flooring with them; services were up to the mark", verified: true },
  { name: "Indradeep Banerjee", time: "", quote: "Wonderful experience working with Elite Pro... The best I have seen so far...", verified: true },
  { name: "Pallavi Tusser", time: "3 years ago", quote: "They have the best services. Helped me to find really good options.", verified: true },
  { name: "Parul Ch.", time: "3 years ago", quote: "Best real estate consultant in Gurgaon", verified: true },
  { name: "Gaurav Thakur", time: "2 years ago", quote: "Amazing environment, wonderful experience professional employees", verified: true },
  { name: "Pallavi Sharma", time: "2 years ago", quote: "Trustable brand. Recommended to all", verified: true },
  { name: "Rakshit Mutneja", time: "2 years ago", quote: "Good experience working with the company", verified: true },
  { name: "Ajay Vatsyayan", time: "2 years ago", quote: "Great experience with them.", verified: true },
  { name: "Pankaj Thakur", time: "3 years ago", quote: "Excellent Service professional team", verified: true },
  { name: "Udit Bhardwaj", time: "2 years ago", quote: "Good experience working with Elite", verified: true },
];
