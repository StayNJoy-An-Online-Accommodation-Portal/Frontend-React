import { useEffect } from "react";

const carouselItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2070&q=80",
    title: "Luxury Redefined",
    description: "Experience unparalleled comfort in our elegant suites",
    buttonText: "Explore Rooms",
    buttonLink: "/rooms",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=2070&q=80",
    title: "Gourmet Dining",
    description: "Savor exquisite culinary delights prepared by our master chefs",
    buttonText: "View Menu",
    buttonLink: "/dining",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=2070&q=80",
    title: "Luxurious Palace",
    description: "Excite your senses with our premium beds in a serene environment",
    buttonText: "Book Now",
    buttonLink: "/hotel",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=2070&q=80",
    title: "A Private Escape in the Clouds",
    description: "Unwind in a serene retreat designed for unforgettable moments, surrounded by panoramic natural beauty",
    buttonText: "Reserve Now",
    buttonLink: "/events",
  },
];

const Carousel = () => {
  /* ================ STYLES ================ */
  const styles = {
    carousel: {
      height: "90vh", 
      overflow: "hidden"
    },
    button: {
      backgroundColor: "#5DADE2",
      borderRadius: "50px",
      padding: "0.75rem 2rem",
      textDecoration: "none"
    }
  };

  /* ================ EFFECTS ================ */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fade-in-down {
        animation: fadeInDown 1s ease forwards;
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  /* ================ HELPERS ================ */
  const getSlideStyle = (image) => ({
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  });

  /* ================ UI ================ */
  return (
    <div
      id="hotelCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      style={styles.carousel}
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#hotelCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner h-100">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`carousel-item h-100 ${
              index === 0 ? "active" : ""
            }`}
            style={getSlideStyle(item.image)}
          >
            <div className="carousel-caption h-100 d-flex flex-column justify-content-center text-start px-5">
              <div className="fade-in-down">
                <h1 className="display-4 fw-bold">{item.title}</h1>
                <p className="lead">{item.description}</p>
                <a
                  href={item.buttonLink}
                  className="btn btn-lg text-white"
                  style={styles.button}
                >
                  {item.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#hotelCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#hotelCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;

