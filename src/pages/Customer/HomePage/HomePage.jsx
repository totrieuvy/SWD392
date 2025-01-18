import React from "react";
import VaccineSection from "../../../components/homepage/VaccineSection/VaccineSection";

const HomePage = () => {
  return (
    <div>
      {/* First Section */}
      <section>
        <img
          src="src\\assets\\HomePage\\Children.jpg"
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
          <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
            Vaccines: A Shield for Your Child's Future
          </h2>
          <p style={{ fontSize: "18px", lineHeight: "1.6", marginTop: "20px" }}>
            At Vaccine Care, we believe every child deserves a healthy start in
            life. Explore our resources to learn about recommended vaccines,
            their benefits, and how they work to protect your child from serious
            illnesses. Together, we can build a healthier tomorrow for all
            children.
          </p>
        </div>

        {/* Right Side: Image */}
        <div style={{ flex: "1 1 300px", textAlign: "right" }}>
          <img
            src="src\\assets\\HomePage\\Children2.jpg"
            alt="Placeholder"
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          />
        </div>
      </section>
      
      {/* Third Section */}
      <VaccineSection/>
    </div>
  );
};

export default HomePage;
