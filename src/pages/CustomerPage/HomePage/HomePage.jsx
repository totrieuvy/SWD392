import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import VaccineSection from "../../../components/homepage/VaccineSection/VaccineSection";

const HomePage = () => {
  // Định nghĩa các variants cho animation
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div>
      {/* First Section */}
      <motion.section initial="hidden" animate="visible" variants={sectionVariants}>
        <img
          src="https://t3.ftcdn.net/jpg/04/78/50/80/360_F_478508020_FRSF7DMKj0oWDvlJDnQG0OXnazaZu1nz.jpg"
          alt="Placeholder"
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
          }}
        />
      </motion.section>

      {/* Second Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "50px 100px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side: Title and Description */}
        <motion.div
          style={{ maxWidth: "50%", flex: "1 1 300px" }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>Vaccines: A Shield for Your Child Future</h2>
          <p style={{ fontSize: "18px", lineHeight: "1.6", marginTop: "20px" }}>
            At Vaccine Care, we believe every child deserves a healthy start in life. Explore our resources to learn
            about recommended vaccines, their benefits, and how they work to protect your child from serious illnesses.
            Together, we can build a healthier tomorrow for all children.
          </p>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          style={{ flex: "1 1 300px", textAlign: "right" }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/698/308/non_2x/female-doctor-injecting-vaccine-to-patient-healthcare-and-medical-concept-drawn-cartoon-art-illustration-vector.jpg"
            alt="Placeholder"
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          />
        </motion.div>
      </motion.section>

      {/* Third Section */}
      <VaccineSection />
    </div>
  );
};

export default HomePage;
