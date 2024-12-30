<template>
  <div>
    <div className="pd-20 ">
      <h3 className="text-primary  text-center">EDITAR EQUIPO</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm">

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
        <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> Editar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'EditarEquipo',
  data() {
    return {

      errors: {}
    };
  }, created() {

    const currentYear = new Date().getFullYear();
    const range = 5;
    this.gestionYears = Array.from({ length: range * 2 + 1 }, (_, i) => currentYear - range + i);
  },
  props: ['item'],
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

      }
    },
    save() {
      const vm = this;
      this.axios.patch(this.baseUrl + "/equipo/" + this.item.id, this.form)
        .then(function (response) {
          if (response.status == '200') {
            vm.$emit('on-update', response.data);

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
    },
    form() {
      return Object.assign({}, this.item);
    }
  },
}
</script>

<style scoped></style>