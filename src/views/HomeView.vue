<template>
  <br>
  <div class="home text-center ">
    <img alt="Vue logo" src="../assets/usip.png" height="120px">
  </div>
  <div class="hello text-center">
    <h1 class="text-success">{{ msg }}</h1>
    
    <h3 class="mb-4">DIPLOMADO EN FULL STACK

DEVELOPER BACKEND Y FRONTEND</h3>
   
    <h4 class="text-primary mb-4">DESARROLLO FRONTEND CON VUE.JS</h4>
    
  
    <p>
      PRACTICA 2 - VUE
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>


<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
