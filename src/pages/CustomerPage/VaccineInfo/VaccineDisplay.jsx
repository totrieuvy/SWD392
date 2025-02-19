import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Slider, Button, Space, Empty, Checkbox, Alert, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import VaccineService from '../../../services/VaccineService';

const VaccineInfo = () => {
  const navigate = useNavigate();
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [ageRange, setAgeRange] = useState([0, 9]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const countries = [
    'United States',
    'United Kingdom',
    'China'
  ];

  // Custom theme configuration
  const theme = {
    token: {
      colorPrimary: '#9989C5',
      colorPrimaryHover: '#9989C5',
    },
    components: {
      Slider: {
        colorPrimary: '#9989C5',
        colorPrimaryBorder: '#9989C5',
        colorPrimaryHover: '#9989C5',
      },
      Checkbox: {
        colorPrimary: '#9989C5',
        colorPrimaryHover: '#9989C5',
        colorPrimaryBorder: '#9989C5',
      },
      Button: {
        colorPrimaryHover: '#9989C5',
        colorPrimaryActive: '#9989C5',
        colorPrimary: '#9989C5',
      },
    },
  };

  // Custom button style
  const buttonStyle = {
    '&:hover': {
      backgroundColor: '#9989C5',
      color: 'white',
      borderColor: '#9989C5',
    },
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        const data = await VaccineService.getAllVaccines();
        setVaccines(data);
        setFilteredVaccines(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch vaccines');
      } finally {
        setLoading(false);
      }
    };
    fetchVaccines();
  }, []);

  useEffect(() => {
    filterVaccines();
  }, [ageRange, priceRange, selectedCountries, vaccines]);

  const filterVaccines = () => {
    if (!Array.isArray(vaccines)) return;
    
    const filtered = vaccines.filter((vaccine) => {
      const ageMatch = 
        vaccine.minAge >= ageRange[0] && vaccine.maxAge <= ageRange[1];
      const priceMatch = 
        vaccine.price >= priceRange[0] && vaccine.price <= priceRange[1];
      const countryMatch = 
        selectedCountries.length === 0 || 
        selectedCountries.includes(vaccine.manufacturer.countryName);
      
      return ageMatch && priceMatch && countryMatch;
    });
    setFilteredVaccines(filtered);
  };

  const handleCountryChange = (checkedValues) => {
    setSelectedCountries(checkedValues);
  };

  const sortByPrice = (ascending = true) => {
    if (!Array.isArray(filteredVaccines)) return;
    
    const sorted = [...filteredVaccines].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price;
    });
    setFilteredVaccines(sorted);
  };

  const handleCardClick = (vaccineId) => {
    navigate(`/vaccination/${vaccineId}`);
  };

  const renderVaccineContent = () => {
    if (loading) {
      return <div>Loading vaccines...</div>;
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      );
    }

    if (!Array.isArray(filteredVaccines) || filteredVaccines.length === 0) {
      return <Empty description="No vaccines found matching your criteria" />;
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredVaccines.map((vaccine) => (
          <Col xs={24} sm={12} lg={8} key={vaccine.vaccineId}>
            <Card
              style={{
                borderRadius: '12px'
              }}
              hoverable
              onClick={() => handleCardClick(vaccine.vaccineId)}
              cover={
                <img
                  alt={vaccine.vaccineName}
                  src={vaccine.image}
                  style={{ height: 200, objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                />
              }
              className="h-full"
            >
              <Card.Meta
                title={vaccine.vaccineName}
                description={
                  <>
                    <p>Price: {formatPrice(vaccine.price)}</p>
                    <p>Manufacturer: {vaccine.manufacturer.name}</p>
                    <p>Country: {vaccine.manufacturer.countryName}</p>
                    <p>Age Range: {vaccine.minAge}-{vaccine.maxAge} years</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <ConfigProvider theme={theme}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={18}>
          {renderVaccineContent()}
        </Col>

        <Col xs={24} md={6}>
          <Card title="Filters">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <h4>Age Range (years)</h4>
                <Slider
                  range
                  min={0}
                  max={9}
                  value={ageRange}
                  onChange={setAgeRange}
                />
              </div>

              <div>
                <h4>Price Range ({formatPrice(0)} - {formatPrice(50)})</h4>
                <Slider
                  range
                  min={0}
                  max={50}
                  value={priceRange}
                  onChange={setPriceRange}
                />
              </div>

              <div>
                <h4>Country</h4>
                <Checkbox.Group 
                  options={countries}
                  value={selectedCountries}
                  onChange={handleCountryChange}
                />
              </div>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  block 
                  onClick={() => sortByPrice(true)}
                  style={buttonStyle}
                >
                  Lowest to Highest
                </Button>
                <Button 
                  block 
                  onClick={() => sortByPrice(false)}
                  style={buttonStyle}
                >
                  Highest to Lowest
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default VaccineInfo;