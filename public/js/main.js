let app = Vue.createApp({
    data() {
        return {
            projects:'',
            selected:'',
            task:''
        }
    },
    mounted () {
        fetch('http://localhost:8000/project', {
            "method": "GET"
        }).then(response => response.json())
        .then(data => {
            this.projects = data
        })
    },
    watch: {
        selected(newValue, oldValue) {
            fetch('http://localhost:8000/project/' + newValue, {
            "method": "GET"
        }).then(response => response.json())
        .then(data => {
            this.task = data
        })
        }
    }
})
app.component('project', {
    props: ['projects', 'modelValue'],
    computed: {
        checkedName: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    template:`
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Projects</h5>
            <hr />
                <div v-for="(item, index) in projects.projects" :key="index" class="form-check">
                        <input class="form-check-input" type="radio" :value="item._id" name="item.name" v-model="checkedName">
                        <label class="form-check-label" for="index" id="index">{{item.name}}</label>
                    
                </div>
        </div>
    </div>
    `
})
app.component('task', {
    props: ['tasks'],
    template: `
        <ul>
        <li v-for="item in tasks.tasks" :key="item._id">
            {{ item.name }}
        </li>
        </ul>
    `
})
app.mount('#app')