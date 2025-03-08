<template>
    <div>
      <h1>Confirmation de Commande</h1>
      <p>Votre commande a été passée avec succès !</p>
      <p>Numéro de commande : {{ $route.params.id }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderConfirmation',
  };
  </script>
  