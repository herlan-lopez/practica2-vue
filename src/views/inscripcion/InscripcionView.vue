<template>
    <div className="about mx-5">

        <div className="pd-20 pt-3">
            <h2 className="text-success  text-center">LISTA DE INSCRIPCIONES</h2>
            <hr />


        </div>
        <Modal v-model:modelValue="showModalNuevo">
            <RegistrarInscripcionView @on-register="onRegister()" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditarInscripcionView @on-update="onUpdate()" :item="itemToEdit" />
        </Modal>

        <button @click="showModalNuevo = true" class="btn btn-success"><i class="fa fa-file"></i> Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right"></button>
        <input type="search" style="float:right" v-model="textToSearch" @input="buscar"
            placeholder="Buscar por cualquier campo">
        <div style="margin: 20px 0;">

            <div class="text-center">
                <h5>Filtros:</h5>
                <form @submit.prevent="filtrar()">
                    <label for="campeonato">Campeonato: </label>
                    <select id="campeonato" v-model="filter.campeonatoId" @change="filtrar">
                        <option value="">Todos</option>
                        <option :value="campeonato.id" v-for="(campeonato, index) in campeonatoList"
                            :key="`campeonato-${index}`">
                            {{ campeonato.nombre_campeonato }}
                        </option>
                    </select>

                    <br>
                    <label for="fecha">Fecha: </label>
                    <input type="date" id="fecha" v-model="filter.fecha" placeholder="Ingrese la fecha"
                        @change="filtrar" />
                </form>
            </div>



        </div>

        <div class="table-responsive">
            <table class="table  table-bordered table-striped">
                <thead>
                    <tr>
                        <th class="bg-dark text-white text-center">Id</th>
                        <th class="bg-dark text-white text-center">Fecha</th>
                        <th class="bg-dark text-white text-center">Hora</th>
                        <th class="bg-dark text-white text-center">Campeonato</th>
                        <th class="bg-dark text-white text-center">Equipo</th>
                        <th class="bg-dark text-white text-center">jugador</th>

                        <th class="bg-dark text-white text-center"></th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(item, index) in paginatedItems" :key="index">
                        <td class="text-center">{{ item.id }}</td>

                        <td class="text-center">{{ item.fecha }}</td>
                        <td class="text-center">{{ item.hora }}</td>
                        <td>{{ item.campeonato.nombre_campeonato }}</td>
                        <td>{{ item.equipo.nombre_equipo }}</td>
                        <td>{{ item.jugador.nombre }} {{ item.jugador.apellido }}</td>

                        <td class="text-center">
                            <button @click="edit(item)" class="btn btn-primary" style="margin-right: 15px;"><i
                                    class="fa fa-edit"></i> </button>
                            <button
                                @click="Eliminar(item.id, item.jugador.nombre, item.jugador.apellido, item.equipo.nombre_equipo)"
                                class="btn btn-danger"><i class="fa fa-trash"></i> </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Anterior</button>
            <span> Página {{ currentPage }} de {{ totalPages }} </span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Siguiente</button>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import RegistrarInscripcionView from './RegistrarInscripcionView.vue';
import EditarInscripcionView from './EditarInscripcionView.vue';


export default {
    name: 'Inscripcion',
    data() {
        return {


            itemsPerPage: 5,  



            currentPage: 1,
            totalPages: 100, 
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            textToFilter: '',
            itemList: [],
            campeonatoList: [],
            path: '',
            filter: {
                fecha: null,
                campeonatoId: ''
            }
        }
    },
    components: {
       
        Modal,
        RegistrarInscripcionView,
        EditarInscripcionView
    },
    methods: {
   
        ...mapActions(['increment']),
        getList() {
            const vm = this;

   
            const params = ["_sort=fecha,hora", "_order=desc,asc", "_expand=equipo", "_expand=jugador", "_expand=campeonato", this.textToFilter ? this.textToFilter : "", this.textToSearch ? `q=${encodeURIComponent(this.textToSearch)}` : "",].filter(Boolean).join("&");
            this.path = `${this.baseUrl}/inscripcion?${params}`;
            this.axios.get(this.path)
                .then(function (response) {
                    vm.itemList = response.data;
                    vm.totalPages = Math.ceil(vm.itemList.length / vm.itemsPerPage);
                })
                .catch(function (error) {
                    console.error("Error fetching data:", error);
                });
        }


        ,
        getCampeonatoList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/campeonato")
                .then(function (response) {
                    vm.campeonatoList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id, nombre, apellido, nombre_equipo) {
            const vm = this;
            Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas eliminar a "${nombre} ${apellido}"del equipo "${nombre_equipo}"? `,
                color: '#fff',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    vm.axios.delete(vm.baseUrl + "/inscripcion/" + id)
                        .then(function (response) {
                            console.log(response);
                            vm.getList();
                            Swal.fire({
                                title: '<span style="color: red;">Eliminacion exitosa</span>',
                                text: `"${nombre} ${apellido}"del equipo "${nombre_equipo}" ha sido eliminado correctamente.`,
                                icon: 'success',
                                color: '#fff',
                                confirmButtonColor: '#3085d6',
                                customClass: {
                                    icon: 'custom-success-icon1'
                                }
                            });

                        })
                        .catch(function (error) {
                            console.error(error);
                            Swal.fire(
                                'Error',
                                'Hubo un problema al intentar eliminar el campeonato.',
                                'error'
                            );
                        });
                }
            });
        },
        buscar() {
            this.getList();
        },
        filtrar() {
            this.textToFilter = '';
            if (this.filter.fecha != null && this.filter.fecha != '') {
                this.textToFilter += "&fecha=" + this.filter.fecha;
            }
            if (this.filter.campeonatoId != null && this.filter.campeonatoId != '') {
                this.textToFilter += "&campeonatoId=" + this.filter.campeonatoId;
            }
            this.getList();
        }
        ,
        onRegister(event) {
            this.getList();
            this.showModalNuevo = false;
            Swal.fire({
                title: '<span style="color: #28a745;">Registro exitoso</span>',
                text: 'El registro se ha completado exitosamente.',
                color: '#fff',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        },
        onUpdate(event) {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            Swal.fire({
                title: '<span style="color: rgb(89, 167, 231);">Edición exitosa</span>',
                text: 'La edición se ha guardado correctamente.',
                color: '#fff',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                customClass: {
                    icon: 'custom-success-icon'
                }
            });
        },
        showToast(message, type) {
            this.$toast.show(message, type);
        }
    },
    computed: {
   
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        },

        paginatedItems() {
     
            const sortedItems = this.itemList.sort((a, b) => a.id - b.id);

    
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;

            return sortedItems.slice(startIndex, endIndex);
        }

    },
    props: {

    },
    mounted() {
        this.getList();
        this.getCampeonatoList();
    },
    emits: [] 
}
</script>

<style></style>