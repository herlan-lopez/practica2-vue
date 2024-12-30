<template>
    < <div className="about mx-5">

        <div className="pd-20 pt-3">
            <h2 class="text-success text-center">LISTA DE JUGADORES</h2>
            <hr />
        </div>

        <Modal v-model:modelValue="showModalNuevo">
            <RegistrarJugadorView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditarJugadorView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>

      
        <button @click="showModalNuevo = true" class="btn btn-success">
            <i class="fa fa-shield"></i> Nuevo
        </button>
        <input type="search" style="float:right" v-model="textToSearch" @input="buscar"
            placeholder="Buscar por cualquier campo">
        <br><br>
       

        <div class="d-flex justify-content-center align-items-center">
            <label for="fecha"> Filtro por Posicion: </label><select v-model="selectedPosition"
                @change="filterByPosition" class="form-select">
                <option value="">Todas las posiciones</option>
                <option v-for="pos in uniquePositions" :key="pos" :value="pos">{{ pos }}</option>
            </select>
        </div>



   
        <div class="table-responsive">
            <table class="table  table-bordered table-striped">
                <thead>
                    <tr>
                        <th class="bg-dark text-white text-center">ID</th>
                        <th class="bg-dark text-white text-center">C.I.</th>
                        <th class="bg-dark text-white text-center">Nombre</th>
                        <th class="bg-dark text-white text-center">Dirección</th>
                        <th class="bg-dark text-white text-center">Fecha Nac.</th>
                        <th class="bg-dark text-white text-center">Celular</th>
                        <th class="bg-dark text-white text-center">Posición</th>
                        <th class="bg-dark text-white text-center">Equipo</th>
                        <th class="bg-dark text-white text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedItems" :key="index">
                        <td>{{ item.id }}</td>
                        <td>{{ item.ci }}</td>
                        <td>{{ item.nombre }} {{ item.apellido }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.fecha_nac }}</td>
                        <td>{{ item.celular }}</td>
                        <td>{{ item.posicion }}</td>
                        <td>{{ item.equipo.nombre_equipo }}</td>
                        <td class="text-center">
                            <button @click="edit(item)" class="btn btn-primary" style="margin-right: 15px;">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button @click="Eliminar(item.id, item.nombre, item.apellido)" class="btn btn-danger">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

  
        <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Siguiente</button>
        </div>
        </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Modal from '../../components/Modal.vue';
import RegistrarJugadorView from './RegistrarJugadorView.vue';
import EditarJugadorView from './EditarJugadorView.vue';

export default {
    name: 'Jugador',
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 5,
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            selectedPosition: '', 
            itemList: [], 
            filteredItemList: [] 
        };
    },
    components: {
        Modal,
        RegistrarJugadorView,
        EditarJugadorView
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl;
        },
        uniquePositions() {
            return [...new Set(this.itemList.map(item => item.posicion))];
        },
        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.filteredItemList.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(this.filteredItemList.length / this.itemsPerPage);
        }
    },
    methods: {
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/jugador?_expand=equipo&q=" + this.textToSearch)
                .then(function (response) {
                    vm.itemList = response.data;
                    vm.filteredItemList = [...vm.itemList];
                    vm.totalPages = Math.ceil(vm.filteredItemList.length / vm.itemsPerPage);
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id, nombre, apellido) {
            const vm = this;
            Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas eliminar al jugador "${nombre} ${apellido}"? `,
                color: '#fff',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    vm.axios.delete(vm.baseUrl + "/jugador/" + id)
                        .then(function () {
                            vm.getList();
                            Swal.fire({
                                title: '<span style="color: red;">Eliminación exitosa</span>',
                                text: `El jugador "${nombre} ${apellido}" ha sido eliminado correctamente.`,
                                icon: 'success',
                                color: '#fff',
                                confirmButtonColor: '#3085d6'
                            });
                        })
                        .catch(function (error) {
                            console.error(error);
                            Swal.fire('Error', 'Hubo un problema al intentar eliminar el jugador.', 'error');
                        });
                }
            });
        },
        buscar() {
            this.getList();
        },
        filterByPosition() {
            if (this.selectedPosition) {
                this.filteredItemList = this.itemList.filter(item => item.posicion === this.selectedPosition);
            } else {
                this.filteredItemList = [...this.itemList];
            }
            this.currentPage = 1; 
        },
        onRegister() {
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
        onUpdate() {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            Swal.fire({
                title: '<span style="color: rgb(89, 167, 231);">Edición exitosa</span>',
                text: 'La edición se ha guardado correctamente.',
                color: '#fff',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        }
    },
    mounted() {
        this.getList();
    }
};
</script>

<style>
.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.pagination button {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
}

select.form-select {
    margin-bottom: 15px;
    padding: 5px;
    font-size: 16px;
    width: 200px;
}
</style>
