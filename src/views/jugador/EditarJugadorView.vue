<template>
  <div>
    <div className="pd-20 ">
      <h3 className="text-primary  text-center">EDITAR JUGADOR</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm" v-if="form">
      <div class="row">
        <div class="col-md-6">

          <div class="form-group">
            <label for="ci">C.I.:</label>
            <input type="number" id="ci" v-model="form.ci" :class="{ 'is-invalid': errors.ci }"
              placeholder="Ingrese el C.I." />
            <div v-if="errors.ci" class="invalid-feedback">{{ errors.ci }}</div>
          </div>

     
          <div class="form-group">
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" v-model="form.apellido" :class="{ 'is-invalid': errors.apellido }"
              placeholder="Ingrese el apellido" />
            <div v-if="errors.apellido" class="invalid-feedback">{{ errors.apellido }}</div>
          </div>

 
          <div class="form-group">
            <label for="direccion">Dirección:</label>
            <textarea id="direccion" v-model="form.direccion" :class="{ 'is-invalid': errors.direccion }"
              placeholder="Ingrese la dirección"></textarea>
            <div v-if="errors.direccion" class="invalid-feedback">{{ errors.direccion }}</div>
          </div>


          <div class="form-group">
            <label for="equipo">Equipo:</label>
            <select id="equipo" v-model="form.equipoId" :class="{ 'is-invalid': errors.equipoId }">
              <option :value="equipo.id" v-for="(equipo, index) in equipoList" :key="`equipo-${index}`">
                {{ equipo.nombre_equipo }}
              </option>
            </select>
            <div v-if="errors.equipoId" class="invalid-feedback">{{ errors.equipoId }}</div>
          </div>





        </div>


        <div class="col-md-6">

  
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }"
              placeholder="Ingrese el nombre" />
            <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
          </div>

          <div class="form-group">
            <label for="fecha_nac">Fecha Nacimiento:</label>
            <input type="date" id="fecha_nac" v-model="form.fecha_nac" :class="{ 'is-invalid': errors.fecha_nac }" />
            <div v-if="errors.fecha_nac" class="invalid-feedback">{{ errors.fecha_nac }}</div>
          </div>

  
          <div class="form-group">
            <label for="celular">Celular:</label>
            <input type="tel" id="celular" v-model="form.celular" :class="{ 'is-invalid': errors.celular }"
              placeholder="Ingrese el teléfono" />
            <div v-if="errors.celular" class="invalid-feedback">{{ errors.celular }}</div>
          </div>

       
          <div class="form-group">
            <label for="posicion">Posición:</label>
            <select id="posicion" v-model="form.posicion" :class="{ 'is-invalid': errors.posicion }">
              <option value="" disabled>Seleccione una posición</option>
              <option value="DELANTERO">Delantero</option>
              <option value="ARQUERO">Arquero</option>
              <option value="DEFENSOR">Defensor</option>
              <option value="MEDIOCAMPO">Mediocampo</option>
            </select>
            <div v-if="errors.posicion" class="invalid-feedback">{{ errors.posicion }}</div>
          </div>
        </div>
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
  name: 'EditarJugador',
  data() {
    return {
      equipoList: [],
      errors: {}
    };
  },
  props: ['item'],
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};



      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es obligatorio.';
      }

      if (!this.form.celular) {
        this.errors.celular = 'El teléfono es obligatorio.';
      } else if (!/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}([-.\s]?\d{1,9})+$/.test(this.item.celular)) {
        this.errors.celular = 'El teléfono no es válido.';
      }

      if (!this.form.direccion) {
        this.errors.direccion = 'La dirección es obligatoria.';
      }

      if (!this.form.equipoId) {
        this.errors.equipoId = 'Debe seleccionar un equipo.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
     
        this.save();
      
        this.form = {
          ci: '',
          nombre: '',
          apellido: '',
          fecha_nac: '',
          celular: '',
          direccion: '',
          posicion: '',
          equipoId: null,
          equipo: null,
        };
      }
    },
    save() {
      const vm = this;
     
      const selectedEquipo = this.equipoList.find(equipo => equipo.id === this.form.equipoId);

      if (selectedEquipo) {
   
        this.form.equipo = selectedEquipo;
      }

      this.axios.patch(this.baseUrl + "/jugador/" + this.item.id, this.form)
        .then(function (response) {
          if (response.status === 200) {
            vm.$emit('on-update', response.data);
          }
          console.log(response);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    , getEquipoList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/equipo")
        .then(function (response) {
          vm.equipoList = response.data;
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
  mounted() {
    this.getEquipoList();
  }
}
</script>

<style scoped></style>