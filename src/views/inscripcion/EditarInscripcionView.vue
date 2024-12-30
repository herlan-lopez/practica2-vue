<template>
  <div>
    
    <div className="pd-20 ">
      <h3 className="text-primary  text-center">EDITAR INSCRIPCION</h3>
      <hr />


    </div>
    <form @submit.prevent="submitForm" v-if="form">
      <div class="form-group">
        <label for="campeonato">Campeonato:</label>
        <select
          id="campeonato"
          v-model="form.campeonatoId"
          :class="{ 'is-invalid': errors.campeonatoId }"
          @change="updateCampeonato"
        >
          <option
            :value="campeonato.id"
            v-for="(campeonato, index) in campeonatoList"
            :key="`campeonato-${index}`"
          >
            {{ campeonato.nombre_campeonato }}
          </option>
        </select>
        <div v-if="errors.campeonatoId" class="invalid-feedback">
          {{ errors.campeonatoId }}
        </div>
      </div>

      <div class="form-group">
        <label for="equipo">Equipo:</label>
        <select
          id="equipo"
          v-model="form.equipoId"
          :class="{ 'is-invalid': errors.equipoId }"
          @change="updateEquipo"
        >
          <option
            :value="equipo.id"
            v-for="(equipo, index) in equipoList"
            :key="`equipo-${index}`"
          >
            {{ equipo.nombre_equipo }}
          </option>
        </select>
        <div v-if="errors.equipoId" class="invalid-feedback">
          {{ errors.equipoId }}
        </div>
      </div>

      <div class="form-group">
        <label for="jugador">Jugador:</label>
        <select
          id="jugador"
          v-model="form.jugadorId"
          :class="{ 'is-invalid': errors.jugadorId }"
          @change="updateJugador"
        >
          <option
            :value="jugador.id"
            v-for="(jugador, index) in jugadorList"
            :key="`jugador-${index}`"
          >
            {{ jugador.nombre }} {{ jugador.apellido }}
          </option>
        </select>
        <div v-if="errors.jugadorId" class="invalid-feedback">
          {{ errors.jugadorId }}
        </div>
      </div>

      <div class="form-group">
        <label for="fecha">Fecha:</label>
        <input
          type="date"
          id="fecha"
          v-model="form.fecha"
          :class="{ 'is-invalid': errors.fecha }"
        />
        <div v-if="errors.fecha" class="invalid-feedback">
          {{ errors.fecha }}
        </div>
      </div>

      <div class="form-group">
        <label for="hora">Hora:</label>
        <input
          type="time"
          id="hora"
          v-model="form.hora"
          :class="{ 'is-invalid': errors.hora }"
        />
        <div v-if="errors.hora" class="invalid-feedback">
          {{ errors.hora }}
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
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "EditarInscripcion",
  props: ["item"], 
  data() {
    return {
      campeonatoList: [],
      equipoList: [],
      jugadorList: [],
      form: null, 
      errors: {},
    };
  },
  methods: {
    ...mapActions(["increment"]),

    validateForm() {
      this.errors = {};

      if (!this.form.campeonatoId) {
        this.errors.campeonatoId = "El campeonato es obligatorio.";
      }
      if (!this.form.equipoId) {
        this.errors.equipoId = "El equipo es obligatorio.";
      }
      if (!this.form.jugadorId) {
        this.errors.jugadorId = "El jugador es obligatorio.";
      }
      if (!this.form.fecha) {
        this.errors.fecha = "La fecha es obligatoria.";
      }
      if (!this.form.hora) {
        this.errors.hora = "La hora es obligatoria.";
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
      this.axios
        .patch(`${this.baseUrl}/inscripcion/${this.item.id}`, this.form)
        .then((response) => {
          if (response.status === 200) {
            vm.$emit("on-update", response.data);
      
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

   
    updateCampeonato() {
      const selectedCampeonato = this.campeonatoList.find(
        (campeonato) => campeonato.id === this.form.campeonatoId
      );
      if (selectedCampeonato) {
        this.form.campeonato = selectedCampeonato;
      }
    },

    updateEquipo() {
      const selectedEquipo = this.equipoList.find(
        (equipo) => equipo.id === this.form.equipoId
      );
      if (selectedEquipo) {
        this.form.equipo = selectedEquipo;
        this.setJugador(); 
      }
    },

   
    updateJugador() {
      const selectedJugador = this.jugadorList.find(
        (jugador) => jugador.id === this.form.jugadorId
      );
      if (selectedJugador) {
        this.form.jugador = selectedJugador;
      }
    },

   
    setJugador() {
      this.axios
        .get(`${this.baseUrl}/jugador?equipoId=${this.form.equipoId}`)
        .then((response) => {
          this.jugadorList = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  computed: {
    ...mapState(["count"]),
    ...mapGetters(["doubleCount", "getBaseUrl"]),
    baseUrl() {
      return this.getBaseUrl;
    },
  },

  mounted() {
    this.form = { ...this.item }; 
    this.getCampeonatoList();
    this.getEquipoList();
    if (this.item.equipoId) {
      this.setJugador(); 
    }
  },
};
</script>

<style scoped>
.invalid-feedback {
  color: red;
  font-size: 0.8rem;
}
</style>
