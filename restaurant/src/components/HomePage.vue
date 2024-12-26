<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="content-wrapper">
        <h1 class="title">Le Délice d'EPSI</h1>
        <p class="subtitle">Restaurant gastronomique</p>
        <router-link to="/menu" class="cta-button">
          Découvrir la carte
        </router-link>
      </div>
    </div>

    <div class="features-section">
      <div class="feature">
        <h3>Notre cuisine</h3>
        <p>Une cuisine raffinée mettant en valeur les produits de saison</p>
      </div>
      <div class="feature">
        <h3>Le restaurant</h3>
        <p>Un cadre chaleureux pour une expérience gastronomique unique</p>
      </div>
      <div class="feature">
        <h3>Commande en ligne</h3>
        <p>Profitez de nos plats directement chez vous</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.hero-section {
  height: 70vh;
  min-height: 500px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.content-wrapper {
  max-width: 800px;
  padding: 0 2rem;
}

.title {
  font-size: 3.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.25rem;
  color: #4a4a4a;
  margin-bottom: 2.5rem;
  letter-spacing: 0.5px;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #1a1a1a;
  border: 1px solid #1a1a1a;
  text-decoration: none;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
}

.cta-button:hover {
  background-color: #333333;
}

.features-section {
  padding: 5rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
}

.feature {
  text-align: center;
  padding: 2rem;
}

.feature h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.feature p {
  color: #4a4a4a;
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .hero-section {
    height: auto;
    padding: 4rem 0;
  }

  .features-section {
    padding: 3rem 1.5rem;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .cta-button {
    padding: 0.875rem 2rem;
  }

  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>
