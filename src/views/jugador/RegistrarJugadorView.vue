<template>
    <div>
      <div className="pd-20 ">
      <h3 className="text-success  text-center">REGISTRAR JUGADOR</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm()">
  <div class="row">

    <div class="col-md-6">

      

      <div class="form-group">
        <label for="ci">C.I. :</label>
        <input type="number" id="ci" v-model="form.ci" :class="{ 'is-invalid': errors.ci }" placeholder="Ingrese el C.I." />
        <div v-if="errors.ci" class="invalid-feedback">{{ errors.ci }}</div>
      </div>

     

      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" v-model="form.apellido" :class="{ 'is-invalid': errors.apellido }" placeholder="Ingrese el apellido" />
        <div v-if="errors.apellido" class="invalid-feedback">{{ errors.apellido }}</div>
      </div>

      
      <div class="form-group">
        <label for="direccion">Dirección:</label>
        <textarea id="direccion" v-model="form.direccion" :class="{ 'is-invalid': errors.direccion }" placeholder="Ingrese la dirección"></textarea>
        <div v-if="errors.direccion" class="invalid-feedback">{{ errors.direccion }}</div>
      </div>

      <div class="form-group">
        <label for="cliente">Equipo:</label>
        <select id="equipo" v-model="form.equipoId" :class="{ 'is-invalid': errors.equipoId }">
          <option :value="equipo.id" v-for="(equipo, index) in equipoList" :key="`equipo-${index}`">{{ equipo.nombre_equipo }}
          </option>
        </select>
        <div v-if="errors.equipoId" class="invalid-feedback">{{ errors.equipoId }}</div>
      </div>

    </div>



   


    <div class="col-md-6">

      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }" placeholder="Ingrese el nombre" />
        <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
      </div>

      <div class="form-group">
        <label for="fecha_nac">Fecha Nacimiento:</label>
        <input type="date" id="fecha_nac" v-model="form.fecha_nac" :class="{ 'is-invalid': errors.fecha_nac }" />
        <div v-if="errors.fecha_nac" class="invalid-feedback">{{ errors.fecha_nac }}</div>
      </div> 

      <div class="form-group">
        <label for="celular">Celular:</label>
        <input type="number" id="celular" v-model="form.celular" :class="{ 'is-invalid': errors.celular }" placeholder="Ingrese el celular" />
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
        <button type="submit" class="btn btn-success"><i class="fa fa-save"></i> Registrar</button>
      </div>
</form>

    </div>
  </template>
    
    <script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
      name: 'RegistrarJugador',
      data() {
        return {
          equipoList: [],
          form: {
            ci: '',
            nombre: '',
            apellido: '',
            fecha_nac: '',
            celular: '',
            direccion: '',
            posicion: '',
            equipoId: null
          },
          errors: {}
        };
      },
      methods: {
        ...mapActions(['increment']),
        validateForm() {
          this.errors = {};
          
          if (!this.form.ci) {
            this.errors.ci = 'El ci es requerido.';
          }
          if (!this.form.nombre) {
            this.errors.nombre = 'El nombre es requerido.';
          }
          if (!this.form.apellido) {
            this.errors.apellido = 'El apellido es requerido.';
          }
          if (!this.form.fecha_nac) {
            this.errors.fecha_nac = 'La fecha de nacimiento es requerida.';
          } else {
            const fechaNac = new Date(this.form.fecha_nac);
            const fechaActual = new Date();
            const limiteFecha = new Date();
            limiteFecha.setFullYear(fechaActual.getFullYear() - 12);
    
            if (fechaNac > limiteFecha) {
              this.errors.fecha_nac = 'Debe tener al menos 12 años.';
            }
          }
          if (!this.form.celular) {
            this.errors.celular = 'El celular es obligatorio.';
          } else if (!/^[67]\d{7}$/.test(this.form.celular)) {
            this.errors.celular = 'El celular no es válido. Debe tener 8 dígitos y empezar con 6 o 7.';
          }
          if (!this.form.direccion) {
            this.errors.direccion = 'La dirección es obligatoria.';
          }
          if (!this.form.posicion) {
            this.errors.posicion = 'La posicion es requerida.';
          }
          if (!this.form.equipoId) {
            this.errors.equipoId = 'Debe seleccionar un equipo.';
          }
    
          return Object.keys(this.errors).length === 0;
        },
        submitForm() {
          if (this.validateForm()) {

            const equipoSeleccionado = this.equipoList.find(
              (equipo) => equipo.id === this.form.equipoId
            );
    
            const jugadorData = {
              ...this.form,
              equipo: equipoSeleccionado ? {
                id: equipoSeleccionado.id,
                nombre_equipo: equipoSeleccionado.nombre_equipo,
                fundacion: equipoSeleccionado.fundacion,
                ubicacion: equipoSeleccionado.ubicacion
              } : null
            };
    
          
            this.save(jugadorData);
    
         
            this.form = {
              ci: '',
              nombre: '',
              apellido: '',
              fecha_nac: '',
              celular: '',
              direccion: '',
              posicion: '',
              equipoId: null
            };
          }
        },
        save(jugadorData) {
          const vm = this;
          this.axios.post(this.baseUrl + "/jugador", jugadorData)
            .then(function (response) {
              if (response.status == '201') {
                vm.$emit('on-register', response.data);
              }
              console.log(response);
            })
            .catch(function (error) {
              console.error(error);
            });
        },
        getEquipoList() {
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
          return this.getBaseUrl;
        }
      },
      mounted() {
        this.getEquipoList();
      }
    };
    </script>
    
    
  <style scoped></style>
    