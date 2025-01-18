import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title } = Typography;

const VaccineSection = () => {
  const vaccines = [
    {
      title: 'Hepatitis B Vaccine (HepB)',
      description: 'Vaccination against Hepatitis B virus',
      imageUrl: 'https://www.bharatbiotech.com/images/revac-b-mcf/revac-packshot.png'
    },
    {
      title: 'Rotavirus Vaccine (RV)',
      description: 'Protection against rotavirus infection',
      imageUrl: 'https://5.imimg.com/data5/SELLER/Default/2024/6/425334283/OX/OL/HX/197025898/rotavirus-rotasiil.jpeg'
    },
    {
      title: 'Diphtheria, Tetanus, and Pertussis Vaccine (DTaP)',
      description: 'Combined vaccine for three diseases',
      imageUrl: 'https://www.cmmediclinic.com/pic/tetanus-diphtheria-pertussis-vaccine-chiang-mai.jpg'
    },
    {
      title: 'Haemophilus influenzae type b Vaccine (Hib)',
      description: 'Prevention of Hib disease',
      imageUrl: 'https://5.imimg.com/data5/SELLER/Default/2020/12/PD/LI/IX/111692368/haemophilus-b-conjugate-vaccine.jpeg'
    },
    {
      title: 'Pneumococcal Conjugate Vaccine (PCV13)',
      description: 'Protection against pneumococcal disease',
      imageUrl: 'https://immunizationinfo.com/wp-content/uploads/Prevnar-13.jpg'
    },
    {
      title: 'Pneumococcal Conjugate Vaccine (PCV13)',
      description: 'Additional vaccine description',
      imageUrl: 'https://www.bizzbuzz.news/h-upload/2024/04/30/1897835-be.webp'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12">
           Vaccines
        </Title>
        <Row gutter={[24, 24]}>
          {vaccines.map((vaccine, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                cover={
                  <img
                    alt={vaccine.title}
                    src={vaccine.imageUrl}
                    className="h-48 object-cover"
                  />
                }
                className="h-full"
              >
                <Card.Meta
                  title={vaccine.title}
                  description={vaccine.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default VaccineSection;