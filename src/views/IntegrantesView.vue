<template>





  <div class="container mt-5">
    <h3 class="mb-3 mt-5 text-center text-primary"><b>INTEGRANTES</b></h3>
    <div class="row">

      <div class="col-md-2 mb-4">
      </div>

      <div class="col-md-4 mb-4">
        <div class="card custom-card">
          <img src="@/assets/herlan.jpg" class="card-img-top" alt="Imagen 2">
          <div class="card-body">
            <p class="card-text text-center"><b><span class="text-dark">Diplomante</span><br>HERLAN ALAN LOPEZ
                GONZALES</b></p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card custom-card">
          <img src="@/assets/lenny.jpg" class="card-img-top" alt="Imagen 1">
          <div class="card-body">

            <p class="card-text text-center"><b><span class="text-dark">Diplomante</span><br> LENNY LINETH MENDOZA
                GUTIERREZ</b></p>
          </div>
        </div>
      </div>



    </div>
  </div>
</template>
<style scoped lang="scss">
.card-img-top {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card:hover .card-img-top {
  opacity: 0.3;
  transform: scale(1.3);
}

.card-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(45, 24, 238);
  font-size: 1.2rem;
  display: none;
}



.card:hover .card-text {
  display: block;
}

.card {
  position: relative;
  overflow: hidden;
}

.custom-card {

  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3), 0 6px 20px rgba(0, 123, 255, 0.2);
  transition: box-shadow 0.3s ease;
  border-radius: 15px;
}

.custom-card:hover {

  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.4), 0 12px 40px rgba(0, 123, 255, 0.3);
}
</style>