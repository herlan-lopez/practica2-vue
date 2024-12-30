<template>
    <div className="about mx-5">

        <div className="pd-20 pt-3">
            <h2 className="text-success  text-center">LISTA DE CAMPEONATO</h2>
            <hr />


        </div>
        <Modal v-model:modelValue="showModalNuevo">
            <RegistrarCampeonatoView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditarCampeonatoView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>

        <button @click="showModalNuevo = true" class="btn btn-success"><i class="fa fa-trophy"></i> Nuevo</button>

        <input type="search" style="float:right" v-model="textToSearch" @input="buscar" placeholder="Buscar por cualquier campo">




        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th class="bg-dark text-white text-center">Id</th>
                        <th class="bg-dark text-white text-center">Nombre</th>
                        <th class="bg-dark text-white text-center">Gestion</th>
                        <th class="bg-dark text-white text-center">Estado</th>
                        <th class="bg-dark text-white text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedItems" :key="index">
                        <td class="text-center">{{ item.id }}</td>
                        <td>{{ item.nombre_campeonato }}</td>
                        <td class="text-center">{{ item.gestion }}</td>
                        <td>{{ item.estado_campeonato }}</td>
                        <td class="text-center">
                            <button @click="edit(item)" class="btn btn-primary" style="margin-right: 15px;"><i
                                    class="fa fa-edit"></i> </button>
                            <button @click="Eliminar(item.id, item.nombre_campeonato)" class="btn btn-danger"><i
                                    class="fa fa-trash"></i> </button>
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
import RegistrarCampeonatoView from './RegistrarCampeonatoView.vue';
import EditarCampeonatoView from './EditarCampeonatoView.vue';

export default {
    name: 'Campeonato',
    data() {
        return {
            message: '',
            currentPage: 1,
            itemsPerPage: 5,  
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            itemList: [],
        }
    },
    components: {
        Modal,
        RegistrarCampeonatoView,
        EditarCampeonatoView
    },
    methods: {
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/campeonato?q=" + this.textToSearch)
                .then(function (response) {
                    console.log(response);
                    vm.itemList = response.data;
                    vm.totalPages = Math.ceil(vm.itemList.length / vm.itemsPerPage);
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id, nombre_campeonato) {
            const vm = this;
            Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas eliminar el campeonato "${nombre_campeonato}"? `,
                color: '#fff',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    vm.axios.delete(vm.baseUrl + "/campeonato/" + id)
                        .then(function (response) {
                            console.log(response);
                            vm.getList();
                            Swal.fire({
                                title: '<span style="color: red;">Eliminacion exitosa</span>',
                                text: `El campeonato "${nombre_campeonato}" ha sido eliminado correctamente.`,
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
        }
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        },

        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.itemList.slice(startIndex, endIndex);
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
</style>
