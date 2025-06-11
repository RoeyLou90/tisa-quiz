<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <h1>好好證券 TISA 投資人格測驗</h1>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <router-view />
      </div>
    </main>
    <footer class="app-footer">
      <div class="container">
        <p>© 2025 好好證券 版權所有</p>
      </div>
    </footer>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #1e3a8a;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-main {
  flex: 1;
  padding: 2rem 0;
  background-color: #f5f7fa;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app-footer {
  background-color: #1e3a8a;
  color: white;
  text-align: center;
  padding: 1rem 0;
  margin-top: auto;
}
</style>
