<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="bg-white rounded-2xl shadow-lg p-4 mb-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MIRJAS Document Generator
        </h1>
        <div class="flex items-center space-x-2">
          <button
            @click="minimizeWindow"
            class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mx-auto text-gray-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16" />
            </svg>
          </button>
          <!-- Maksymalizuj -->
          <button
            @click="toggleMaximizeWindow"
            class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mx-auto text-gray-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4z" />
            </svg>
          </button>
          <!-- Zamknij -->
          <button
            @click="closeWindow"
            class="w-8 h-8 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mx-auto text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-800">Generate Document</h2>
            <p class="text-gray-500 mt-1">Create and manage your documents effortlessly</p>
          </div>
          <button
            @click="handleGenerate"
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isProcessing"
          >
            <span class="flex items-center justify-center gap-2">
              <ArrowPathIcon v-if="isProcessing" class="animate-spin h-5 w-5" />
              {{ isProcessing ? 'Generating...' : 'Generate Document' }}
            </span>
          </button>
        </div>

        <!-- Mode Selector -->
        <div class="mb-8">
          <div class="bg-gray-100 p-1 rounded-xl inline-flex w-full">
            <button
              v-for="mode in modes"
              :key="mode.id"
              @click="currentMode = mode.id"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out',
                currentMode === mode.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              ]"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="handleGenerate" class="space-y-8">
          <!-- Common Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800">General Information</h3>

              <!-- Client Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Client</label>
                <div class="flex rounded-xl shadow-sm ring-1 ring-gray-200">
                  <select
                    v-model="formData[currentMode].clientType"
                    class="flex-none rounded-l-xl border-0 bg-transparent py-3 pl-4 pr-8 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    <option value="custom">Custom</option>
                    <option value="Z">Z</option>
                    <option value="X">X</option>
                  </select>
                  <input
                    v-if="formData[currentMode].clientType === 'custom'"
                    v-model="formData[currentMode].clientCustom"
                    type="text"
                    class="flex-1 rounded-r-xl border-0 bg-transparent py-3 pl-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    placeholder="Enter client name..."
                  />
                </div>
              </div>

              <!-- Contractor Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Contractor</label>
                <div class="flex rounded-xl shadow-sm ring-1 ring-gray-200">
                  <select
                    v-model="formData[currentMode].contractorType"
                    class="flex-none rounded-l-xl border-0 bg-transparent py-3 pl-4 pr-8 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    <option value="custom">Custom</option>
                    <option value="Z">Z</option>
                    <option value="X">X</option>
                  </select>
                  <input
                    v-if="formData[currentMode].contractorType === 'custom'"
                    v-model="formData[currentMode].contractorCustom"
                    type="text"
                    class="flex-1 rounded-r-xl border-0 bg-transparent py-3 pl-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    placeholder="Enter contractor name..."
                  />
                </div>
              </div>

              <!-- File Upload -->
              <div
                class="drop-area p-6 rounded-xl border-dashed border-2 border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer flex flex-col items-center justify-center"
                @click="openFilePicker"
              >
                <input
                  type="file"
                  ref="fileInputRef"
                  @change="handleFileChange"
                  style="display: none;"
                />
                <DocumentIcon class="h-12 w-12 mb-2" />
                <div v-if="!selectedFile">
                  Click here to upload CSV file
                </div>
                <div v-else class="file-info flex items-center space-x-2">
                  <DocumentTextIcon class="h-5 w-5" />
                  <span>{{ selectedFile.name }}</span>
                  <button @click.stop="removeFile" class="text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Mode Specific Fields -->
            <div v-if="currentMode === 'mode1'" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800">Training Information</h3>

              <!-- Training Dates -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="type in ['R', 'AB', 'PK']" :key="type" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ type }} Training Date</label>
                  <input
                    type="date"
                    v-model="formData.mode1[`trainingDate${type}`]"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Signature Date Type -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Signature Date Type</label>
                <div class="flex gap-6">
                  <label class="relative flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="formData.mode1.signatureDateType" value="single"
                           class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span>Single Date</span>
                  </label>
                  <label class="relative flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="formData.mode1.signatureDateType" value="multiple"
                           class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span>Multiple Dates</span>
                  </label>
                </div>
              </div>

              <!-- Single/Multiple Signature Dates -->
              <div v-if="formData.mode1.signatureDateType === 'single'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Signature Date</label>
                <input
                  type="date"
                  v-model="formData.mode1.singleSignatureDate"
                  class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                />
              </div>
              <div v-else-if="formData.mode1.signatureDateType === 'multiple'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="type in ['R', 'AB', 'PK']" :key="type" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ type }} Signature Date</label>
                  <input
                    type="date"
                    v-model="formData.mode1[`signatureDate${type}`]"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div v-else-if="currentMode === 'mode2'" class="space-y-8">
              <div>
                <h3 class="text-xl font-semibold text-gray-800">Separation Information</h3>
                <div class="mt-4 space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Separation Date</label>
                  <input
                    type="date"
                    v-model="formData.mode2.separationDate"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Before/After Separation Sections -->
              <div v-for="period in ['before', 'after']" :key="period"
                   class="bg-gray-50 rounded-xl p-6 space-y-6">
                <h4 class="text-lg font-medium text-gray-800 capitalize">
                  {{ period }} {{ formData.mode2.separationDate || '(separation date)' }}
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div v-for="type in ['R', 'AB', 'PK']" :key="`${period}-${type}`" class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">{{ type }} Training Date</label>
                    <input
                      type="date"
                      v-model="formData.mode2[`${period}TrainingDate${type}`]"
                      class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Signature Date Type</label>
                  <div class="flex gap-6">
                    <label class="relative flex items-center gap-3 cursor-pointer">
                      <input type="radio" v-model="formData.mode2[`${period}SignatureDateType`]" value="single"
                             class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span>Single Date</span>
                    </label>
                    <label class="relative flex items-center gap-3 cursor-pointer">
                      <input type="radio" v-model="formData.mode2[`${period}SignatureDateType`]" value="multiple"
                             class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span>Multiple Dates</span>
                    </label>
                  </div>
                </div>

                <div v-if="formData.mode2[`${period}SignatureDateType`] === 'single'" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Signature Date</label>
                  <input
                    type="date"
                    v-model="formData.mode2[`${period}SingleSignatureDate`]"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  />
                </div>

                <div v-else-if="formData.mode2[`${period}SignatureDateType`] === 'multiple'"
                     class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div v-for="type in ['R', 'AB', 'PK']" :key="`${period}-${type}-signature`" class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">{{ type }} Signature Date</label>
                    <input
                      type="date"
                      v-model="formData.mode2[`${period}SignatureDate${type}`]"
                      class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentMode === 'mode3'" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800">Initial Numbers & Training</h3>

              <!-- Initial Numbers -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="type in ['R', 'AB', 'PK']" :key="`initial-${type}`" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Initial Number {{ type }}</label>
                  <input
                    type="text"
                    v-model="formData.mode3[`initialNumber${type}`]"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    placeholder="Enter number..."
                  />
                </div>
              </div>

              <!-- Training Dates -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="type in ['R', 'AB', 'PK']" :key="`training-${type}`" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ type }} Training Date</label>
                  <input
                    type="date"
                    v-model="formData.mode3[`trainingDate${type}`]"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Signature Date Type -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Signature Date Type</label>
                <div class="flex gap-6">
                  <label class="relative flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="formData.mode3.signatureDateType" value="single"
                           class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span>Single Date</span>
                  </label>
                  <label class="relative flex items-center gap-3 cursor-pointer">
                    <input type="radio" v-model="formData.mode3.signatureDateType" value="multiple"
                           class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span>Multiple Dates</span>
                  </label>
                </div>
              </div>

              <!-- Single/Multiple Signature Dates -->
              <div v-if="formData.mode3.signatureDateType === 'single'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Signature Date</label>
                <input
                  type="date"
                  v-model="formData.mode3.singleSignatureDate"
                  class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                />
              </div>
              <div v-else-if="formData.mode3.signatureDateType === 'multiple'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="type in ['R', 'AB', 'PK']" :key="`signature-${type}`" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ type }} Signature Date</label>
                  <input
                    type="date"
                    v-model="formData.mode3[`signatureDate${type}`]"
                    class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <!-- Status Message -->
        <div
          v-if="status"
          :class="[
            'mt-6 p-4 rounded-xl transition-all duration-300 ease-in-out flex items-center gap-3',
            status.includes('Error')
              ? 'bg-red-50 text-red-800 ring-1 ring-red-200'
              : 'bg-green-50 text-green-800 ring-1 ring-green-200'
          ]"
        >
          <ExclamationCircleIcon v-if="status.includes('Error')"
               class="h-5 w-5 text-red-400" />
          <CheckCircleIcon v-else
               class="h-5 w-5 text-green-400" />
          {{ status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const { ipcRenderer } = require('electron')
import { MinusIcon, ArrowsPointingOutIcon, XMarkIcon, DocumentIcon, DocumentTextIcon, ArrowPathIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'


const minimizeWindow = async () => {
  ipcRenderer.send("minimize-window");
}
const toggleMaximizeWindow = async () => {
  ipcRenderer.send("toggle-maximize-window");
}
const closeWindow = async () => {
  ipcRenderer.send("close-window");
}

// Utwórz referencję do elementu input
const fileInputRef = ref(null)
const selectedFile = ref(null)

const openFilePicker = () => {
  fileInputRef.value.click()
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const removeFile = () => {
  selectedFile.value = null
  fileInputRef.value.value = null // resetuje wartość inputu
}


// Definicja trybów
const modes = [
  { id: 'mode1', name: 'Tryb Jeden Termin' },
  { id: 'mode2', name: 'Tryb Zakres' },
  { id: 'mode3', name: 'Tryb Numer' }
]

// Aktywny tryb
const currentMode = ref('mode1')

// Stan formularza
const formData = reactive({
  mode1: {
    // Klient
    clientType: 'custom',
    clientCustom: '',

    // Wykonawca
    contractorType: 'custom',
    contractorCustom: '',
    filePath: '',

    // Daty szkoleń
    trainingDateR: '',
    trainingDateAB: '',
    trainingDatePK: '',

    // Typ dat podpisu
    signatureDateType: 'single',

    // Daty podpisu
    singleSignatureDate: '',
    signatureDateR: '',
    signatureDateAB: '',
    signatureDatePK: ''
  },
  mode2: {
    clientType: 'custom',
    clientCustom: '',

    // Wykonawca
    contractorType: 'custom',
    contractorCustom: '',
    filePath: '',

    separationDate: '',
    beforeTrainingDateR1: '',
    beforeTrainingDateAB1: '',
    beforeTrainingDatePK1: '',
    beforeSignatureDateType: 'single',
    beforeSingleSignatureDate: '',
    beforeSignatureDateR: '',
    beforeSignatureDateAB: '',
    beforeSignatureDatePK: '',
    afterTrainingDateR1: '',
    afterTrainingDateAB1: '',
    afterTrainingDatePK1: '',
    afterSignatureDateType: 'single',
    afterSingleSignatureDate: '',
    afterSignatureDateR: '',
    afterSignatureDateAB: '',
    afterSignatureDatePK: ''
  },
  mode3: {
    clientType: 'custom',
    clientCustom: '',
    contractorType: 'custom',
    contractorCustom: '',
    filePath: '',
    initialNumberR: '',
    initialNumberAB: '',
    initialNumberPK: '',
    trainingDateR: '',
    trainingDateAB: '',
    trainingDatePK: '',
    signatureDateType: 'single',
    singleSignatureDate: '',
    signatureDateR: '',
    signatureDateAB: '',
    signatureDatePK: ''
  }
})

const status = ref('')
const isProcessing = ref(false)

// Funkcja generowania dokumentu
const handleGenerate = async () => {
  console.log(formData.mode1.filePath)
  isProcessing.value = true
  try {
    // Przygotowanie danych do wysłania, różne dla mode1, mode2 i mode3
    let data;

    if (currentMode.value === 'mode1') {
      data = {
        mode: 'mode1',
        data: {
          client: formData.mode1.clientType === 'custom' ? formData.mode1.clientCustom : formData.mode1.clientType,
          contractor: formData.mode1.contractorType === 'custom' ? formData.mode1.contractorCustom : formData.mode1.contractorType,
          trainingDates: {
            R: formData.mode1.trainingDateR,
            AB: formData.mode1.trainingDateAB,
            PK: formData.mode1.trainingDatePK
          },
          signatureDates: formData.mode1.signatureDateType === 'single'
            ? { single: formData.mode1.singleSignatureDate }
            : {
                R: formData.mode1.signatureDateR,
                AB: formData.mode1.signatureDateAB,
                PK: formData.mode1.signatureDatePK
              },
          path: formData.mode1.filePath.value
        }
      };
    } else if (currentMode.value === 'mode2') {
      data = {
        mode: 'mode2',
        data: {
          client: formData.mode2.clientType === 'custom' ? formData.mode2.clientCustom : formData.mode2.clientType,
          contractor: formData.mode2.contractorType === 'custom' ? formData.mode2.contractorCustom : formData.mode2.contractorType,
          separationDate: formData.mode2.separationDate,
          beforeTrainingDates: {
            R1: formData.mode2.beforeTrainingDateR1,
            AB1: formData.mode2.beforeTrainingDateAB1,
            PK1: formData.mode2.beforeTrainingDatePK1
          },
          beforeSignatureDates: formData.mode2.beforeSignatureDateType === 'single'
            ? { single: formData.mode2.beforeSingleSignatureDate }
            : {
                R: formData.mode2.beforeSignatureDateR,
                AB: formData.mode2.beforeSignatureDateAB,
                PK: formData.mode2.beforeSignatureDatePK
              },
          afterTrainingDates: {
            R1: formData.mode2.afterTrainingDateR1,
            AB1: formData.mode2.afterTrainingDateAB1,
            PK1: formData.mode2.afterTrainingDatePK1
          },
          afterSignatureDates: formData.mode2.afterSignatureDateType === 'single'
            ? { single: formData.mode2.afterSingleSignatureDate }
            : {
                R: formData.mode2.afterSignatureDateR,
                AB: formData.mode2.afterSignatureDateAB,
                PK: formData.mode2.afterSignatureDatePK
              },
          path: formData.mode2.filePath
        }
      };
    } else if (currentMode.value === 'mode3') {
      data = {
        mode: 'mode3',
        data: {
          initialNumbers: {
            R: formData.mode3.initialNumberR,
            AB: formData.mode3.initialNumberAB,
            PK: formData.mode3.initialNumberPK
          },
          trainingDates: {
            R1: formData.mode3.trainingDateR,
            AB1: formData.mode3.trainingDateAB,
            PK1: formData.mode3.trainingDatePK
          },
          signatureDates: formData.mode3.signatureDateType === 'single'
            ? { single: formData.mode3.singleSignatureDate }
            : {
                R: formData.mode3.signatureDateR,
                AB: formData.mode3.signatureDateAB,
                PK: formData.mode3.signatureDatePK
              },
          path: formData.mode3.filePath
        }
      };
    }

    // Wysyłanie danych
    const result = await ipcRenderer.invoke('create-document', JSON.stringify(data))
    status.value = result.status
  } catch (error) {
    status.value = `Error: ${error}`
  } finally {
    isProcessing.value = false
  }
}
</script>
<style scoped>
.drop-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  background-color: #f9fafb;
}
</style>
