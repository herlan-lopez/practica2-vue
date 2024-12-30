<template>
  <div>
    <div className="pd-20 ">
      <h3 className="text-primary  text-center">EDITAR CAMPEONATO</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="nombre_campeonato" v-model="form.nombre_campeonato"
          :class="{ 'is-invalid': errors.nombre_campeonato }" placeholder="Ingrese el nombre" />
        <div v-if="errors.nombre_campeonato" class="invalid-feedback">{{ errors.nombre_campeonato }}</div>
      </div>



      <div class="form-group">
        <label for="gestion">Gestión:</label>
        <select id="gestion" v-model="form.gestion" :class="{ 'is-invalid': errors.gestion }">
          <option value="" disabled>Seleccione una gestión</option>
          <option v-for="year in gestionYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <div v-if="errors.gestion" class="invalid-feedback">{{ errors.gestion }}</div>
      </div>






      <div class="form-group">
        <label for="position">Estado:</label>
        <select id="estado_campeonato" v-model="form.estado_campeonato"
          :class="{ 'is-invalid': errors.estado_campeonato }">
          <option value="" disabled>Seleccione una posición</option>
          <option value="EN MARCHA">EN MARCHA</option>
          <option value="FINALIZADO">FINALIZADO</option>

        </select>
        <div v-if="errors.estado_campeonato" class="invalid-feedback">{{ errors.estado_campeonato }}</div>
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
  name: 'EditarCampeonato',
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

      if (!this.form.nombre_campeonato) {
        this.errors.nombre_campeonato = 'El nombre del campeonato es requerido.';
      }

      if (!this.form.gestion) {
        this.errors.gestion = 'La gestion es requerida.';
      }


      if (!this.form.estado_campeonato) {
        this.errors.estado_campeonato = 'El estado del campeonato es requerido.';
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
      this.axios.patch(this.baseUrl + "/campeonato/" + this.item.id, this.form)
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