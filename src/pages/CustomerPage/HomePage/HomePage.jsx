import React from "react";
import VaccineSection from "../../../components/homepage/VaccineSection/VaccineSection";

const HomePage = () => {
  return (
    <div>
      {/* First Section */}
      <section>
        <img
          src="https://t3.ftcdn.net/jpg/04/78/50/80/360_F_478508020_FRSF7DMKj0oWDvlJDnQG0OXnazaZu1nz.jpg"
          alt="Placeholder"
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover", // Ensures the image covers the space without distortion
          }}
        />
      </section>

      {/* Second Section */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "50px 100px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side: Title and Description */}
        <div style={{ maxWidth: "50%", flex: "1 1 300px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>Vaccines: A Shield for Your Child Future</h2>
          <p style={{ fontSize: "18px", lineHeight: "1.6", marginTop: "20px" }}>
            At Vaccine Care, we believe every child deserves a healthy start in life. Explore our resources to learn
            about recommended vaccines, their benefits, and how they work to protect your child from serious illnesses.
            Together, we can build a healthier tomorrow for all children.
          </p>
        </div>

        {/* Right Side: Image */}
        <div style={{ flex: "1 1 300px", textAlign: "right" }}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/698/308/non_2x/female-doctor-injecting-vaccine-to-patient-healthcare-and-medical-concept-drawn-cartoon-art-illustration-vector.jpg"
            alt="Placeholder"
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          />
        </div>
      </section>

      {/* Third Section */}
      <VaccineSection />
    </div>
  );
};

export default HomePage;
