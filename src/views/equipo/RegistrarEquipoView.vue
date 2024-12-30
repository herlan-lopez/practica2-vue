<template>
  <div>
    <div className="pd-20 ">
      <h3 className="text-success  text-center">REGISTRAR EQUIPO</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm()">



      <div class="form-group">
        <label for="name">Equipo:</label>
        <input type="text" id="nombre_equipo" v-model="form.nombre_equipo"
          :class="{ 'is-invalid': errors.nombre_equipo }" placeholder="Ingrese el nombre del equipo" />
        <div v-if="errors.nombre_equipo" class="invalid-feedback">{{ errors.nombre_equipo }}</div>
      </div>

      <div class="form-group">
        <label for="name">Fundación:</label>
        <input type="date" id="fundacion" v-model="form.fundacion"
          :class="{ 'is-invalid': errors.fundacion }"  />
        <div v-if="errors.fundacion" class="invalid-feedback">{{ errors.fundacion }}</div>
      </div>


      <div class="form-group">
        <label for="name">Ubicación:</label>
        <input type="text" id="ubicacion" v-model="form.ubicacion"
          :class="{ 'is-invalid': errors.ubicacion }" placeholder="Ingrese la ubicacion" />
        <div v-if="errors.ubicacion" class="invalid-feedback">{{ errors.ubicacion }}</div>
      </div>



      <hr />
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success"><i class="fa fa-save"></i> Registrar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'RegistrarEquipo',
  data() {
    return {
      form: {
        nombre_equipo: '',
        fundacion: '',
        ubicacion: '',

      },
      errors: {}
    };
  },
  created() {
   
    const currentYear = new Date().getFullYear();
    const range = 5;
    this.gestionYears = Array.from({ length: range * 2 + 1 }, (_, i) => currentYear - range + i);
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};



      if (!this.form.nombre_equipo) {
        this.errors.nombre_equipo = 'El nombre del equipo es requerido.';
      }

      if (!this.form.fundacion) {
        this.errors.fundacion = 'La fundacion es requerida.';
      }


      if (!this.form.ubicacion) {
        this.errors.ubicacion = 'La ubicacion es requerida.';
      }


      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {

        this.save();
     
        this.form = {
          nombre_equipo: '',
        fundacion: '',
        ubicacion: '',
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/equipo", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);

          }
          console.log(response);
  
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
  computed: {
   
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
}
</script>

<style scoped></style>