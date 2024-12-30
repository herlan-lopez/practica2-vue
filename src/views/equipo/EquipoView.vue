<template>
    <div className="about mx-5">

        <div className="pd-20 pt-3">
            <h2 class="text-success  text-center">LISTA DE EQUIPOS</h2>
            <hr />
        </div>

        <Modal v-model:modelValue="showModalNuevo">
            <RegistrarEquipoView @on-register="onRegister($event)" />
        </Modal>

        <Modal v-model:modelValue="showModalEdit">
            <EditarEquipoView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>

   
        <button @click="showModalNuevo = true" class="btn btn-success">
            <i class="fa fa-shield"></i> Nuevo
        </button>

        <input type="search" style="float:right" v-model="textToSearch" @input="buscar"
            placeholder="Buscar por cualquier campo">



        <div class="table-responsive"> 
            <div class="d-flex justify-content-center align-items-center">
                <label for="fecha"> Filtro por Ubicacion: </label>
                <select v-model="selectedLocation" @change="filterByLocation" class="form-select"
                    style="margin-bottom: 15px;">
                    <option value="">Todas las ubicaciones</option>
                    <option v-for="location in uniqueLocations" :key="location" :value="location">{{ location }}
                    </option>
                </select>
            </div>
            <table class="table  table-bordered table-striped">
                <thead>
                    <tr>
                        <th class="bg-dark text-white text-center">Id</th>
                        <th class="bg-dark text-white text-center">Equipo</th>
                        <th class="bg-dark text-white text-center">Fundación</th>
                        <th class="bg-dark text-white text-center">Ubicación</th>
                        <th class="bg-dark text-white text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedItems" :key="index">
                        <td class="text-center">{{ item.id }}</td>
                        <td>{{ item.nombre_equipo }}</td>
                        <td class="text-center">{{ item.fundacion }}</td>
                        <td>{{ item.ubicacion }}</td>
                        <td class="text-center">
                            <button @click="edit(item)" class="btn btn-primary" style="margin-right: 15px;">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button @click="Eliminar(item.id, item.nombre_equipo)" class="btn btn-danger">
                                <i class="fa fa-trash"></i>
                            </button>
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
import RegistrarEquipoView from './RegistrarEquipoView.vue';
import EditarEquipoView from './EditarEquipoView.vue';

export default {
    name: 'Campeonato',
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 5,
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            selectedLocation: '',  
            itemList: [],
            filteredItemList: [] 
        }
    },
    components: {
        Modal,
        RegistrarEquipoView,
        EditarEquipoView
    },
    methods: {
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/equipo?q=" + this.textToSearch)
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
        Eliminar(id, nombre_equipo) {
            const vm = this;
            Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas eliminar el equipo "${nombre_equipo}"? `,
                color: '#fff',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    vm.axios.delete(vm.baseUrl + "/equipo/" + id)
                        .then(function (response) {
                            console.log(response);
                            vm.getList();
                            Swal.fire({
                                title: '<span style="color: red;">Eliminación exitosa</span>',
                                text: `El equipo "${nombre_equipo}" ha sido eliminado correctamente.`,
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
        onRegister(event) {
            console.log("on register");
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
            console.log("on update");
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
            console.log("showToast");
            this.$toast.show(message, type);
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
      
        filterByLocation() {
            if (this.selectedLocation) {
                this.filteredItemList = this.itemList.filter(item => item.ubicacion === this.selectedLocation);
            } else {
                this.filteredItemList = [...this.itemList];
            }
            this.currentPage = 1; 
        }
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl;
        },
 
        uniqueLocations() {
            return [...new Set(this.itemList.map(item => item.ubicacion))];
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
    mounted() {
        this.getList();
    },
}
</script>

<style>
.custom-success-icon .swal2-success-line-tip,
.custom-success-icon .swal2-success-line-long {
    background-color: rgb(89, 167, 231) !important;
}

.custom-success-icon1 .swal2-success-line-tip,
.custom-success-icon1 .swal2-success-line-long {
    background-color: red !important;
}

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
