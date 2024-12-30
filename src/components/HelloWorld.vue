<template>
  <div class="hello">
    <h1 class="text-success">{{ msg }}</h1>
    
    <h3>DIPLOMADO EN FULL STACK

DEVELOPER BACKEND Y FRONTEND</h3>
   
    <h4 class="text-primary">DESARROLLO FRONTEND CON VUE.JS</h4>
    
  
    <p>
      PRACTICA 1 - VUE
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
