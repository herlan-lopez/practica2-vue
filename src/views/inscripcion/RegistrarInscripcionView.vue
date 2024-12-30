<template>
  <div>
    <div className="pd-20 ">
      <h3 className="text-success  text-center">REGISTRAR INSCRIPCION</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="campeonato">Campeonato:</label>
        <select id="campeonato" v-model="form.campeonatoId" :class="{ 'is-invalid': errors.campeonatoId }">
          <option :value="campeonato.id" v-for="(campeonato, index) in campeonatoList" :key="`campeonato-${index}`">
            {{ campeonato.nombre_campeonato }}
          </option>
        </select>
        <div v-if="errors.campeonatoId" class="invalid-feedback">{{ errors.campeonatoId }}</div>
      </div>

      <div class="form-group">
        <label for="equipo">Equipo:</label>
        <select id="equipo" v-model="form.equipoId" :class="{ 'is-invalid': errors.equipoId }" @change="setJugador">
          <option :value="equipo.id" v-for="(equipo, index) in equipoList" :key="`equipo-${index}`">
            {{ equipo.nombre_equipo }}
          </option>
        </select>
        <div v-if="errors.equipoId" class="invalid-feedback">{{ errors.equipoId }}</div>
      </div>

      <div class="form-group">
        <label for="jugador">Jugador:</label>
        <select id="jugador" v-model="form.jugadorId" :class="{ 'is-invalid': errors.jugadorId }">
          <option :value="jugador.id" v-for="(jugador, index) in jugadorList" :key="`jugador-${index}`">
            {{ jugador.nombre }} {{ jugador.apellido }}
          </option>
        </select>
        <div v-if="errors.jugadorId" class="invalid-feedback">{{ errors.jugadorId }}</div>
      </div>

   <!-- <div class="form-group">
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" v-model="form.fecha" :class="{ 'is-invalid': errors.fecha }" />
        <div v-if="errors.fecha" class="invalid-feedback">{{ errors.fecha }}</div>
      </div>

      <div class="form-group">
        <label for="hora">Hora:</label>
        <input type="time" id="hora" v-model="form.hora" :class="{ 'is-invalid': errors.hora }" />
        <div v-if="errors.hora" class="invalid-feedback">{{ errors.hora }}</div>
      </div>-->  

      <hr />
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success"><i class="fa fa-save"></i> Registrar</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegistrarInscripcion',
  data() {
    return {
      campeonatoList: [],
      equipoList: [],
      jugadorList: [],
      form: {
        campeonatoId: null,
        equipoId: null,
        jugadorId: null,
        fecha: null,
        hora: null,
      },
      errors: {},
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.campeonatoId) {
        this.errors.campeonatoId = 'El campeonato es obligatorio.';
      }

      if (!this.form.equipoId) {
        this.errors.equipoId = 'El equipo es obligatorio.';
      }

      if (!this.form.jugadorId) {
        this.errors.jugadorId = 'El jugador es obligatorio.';
      }

      /*
      if (!this.form.fecha) {
        this.errors.fecha = 'La fecha es obligatoria.';
      }

      if (!this.form.hora) {
        this.errors.hora = 'La hora es obligatoria.';
      }*/

      if (this.jugadorList.find((jugador) => jugador.id === this.form.jugadorId)?.equipoId !== this.form.equipoId) {
    this.errors.jugadorId = 'El jugador no pertenece al equipo seleccionado.';
    return false;
}


      return Object.keys(this.errors).length === 0;
    },
    submitForm() {
      if (this.validateForm()) {
        this.save();
        this.form = {
          campeonatoId: null,
          equipoId: null,
          jugadorId: null,
          fecha: null,
          hora: null,
        };
        this.jugadorList = [];
      }
    },
    save() {
      const inscripcionData = {
        id: null,
        campeonatoId: this.form.campeonatoId,
        jugadorId: this.form.jugadorId,
        equipoId: this.form.equipoId,
        fecha: this.form.fecha,
        hora: this.form.hora,
        equipo: this.equipoList.find((equipo) => equipo.id === this.form.equipoId),
        campeonato: this.campeonatoList.find((campeonato) => campeonato.id === this.form.campeonatoId),
        jugador: this.jugadorList.find((jugador) => jugador.id === this.form.jugadorId),
      };

      this.axios
        .post(`${this.baseUrl}/inscripcion`, inscripcionData)
        .then((response) => {
          if (response.status === 201) {
            alert('Inscripción registrada exitosamente.');
            this.$emit('on-register', response.data);
          }
        })
        .catch((error) => {
          console.error(error);
         
        });
    },
    getCampeonatoList() {
      this.axios
        .get(`${this.baseUrl}/campeonato`)
        .then((response) => {
          this.campeonatoList = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getEquipoList() {
      this.axios
        .get(`${this.baseUrl}/equipo`)
        .then((response) => {
          this.equipoList = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setJugador() {
      this.axios
        .get(`${this.baseUrl}/jugador?equipoId=${this.form.equipoId}`)
        .then((response) => {
          this.jugadorList = response.data;
          if (this.jugadorList.length === 0) {
            alert('No hay jugadores disponibles para este equipo.');
          }
        })
        .catch((error) => {
          console.error(error);
          alert('Error al obtener la lista de jugadores.');
        });
    },
  },
  computed: {
    baseUrl() {
      return this.$store.getters.getBaseUrl;
    },
  },
  mounted() {
    this.getEquipoList();
    this.getCampeonatoList();

    const currentDate = new Date();
  this.form.fecha = currentDate.toISOString().split('T')[0]; 


  const hours = currentDate.getHours().toString().padStart(2, '0'); 
  const minutes = currentDate.getMinutes().toString().padStart(2, '0'); 
  this.form.hora = `${hours}:${minutes}`; 
  },
};
</script>

<style scoped>
.invalid-feedback {
  color: red;
  font-size: 0.8rem;
}
</style>
