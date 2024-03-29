<template>
  <div class="bgView">
    <div :class="['json-view', length ? 'closeable' : '']" :style="'font-size:' + fontSize+'px'">
      <span v-if="length" :class="['angle', innerclosed ? 'closed' : '']" @click="toggleClose" />
      <div class="content-wrap">
        <p class="first-line">
          <span v-if="jsonKey" class="json-key">"{{ jsonKey }}": </span>
          <span v-if="length">{{ prefix }}{{ innerclosed ? ('...' + subfix) : '' }}</span>
          <span v-if="!length">{{ isArray ? '[]' : '{}' }}</span>
        </p>
        <div v-if="!innerclosed && length" class="json-body">
          <template v-for="(item, index) in items">
            <json-view
              v-if="item.isJSON"
              :key="index"
              :closed="closed"
              :json="item.value"
              :json-key="item.key"
              :is-last="index === items.length - 1"
            />
            <p v-else :key="index" class="json-item">
              <span class="json-key">{{ (isArray ? index : '"' + item.key + '"') }}</span>
              :
              <span class="json-value">{{ item.value + (index === items.length - 1 ? '' : ',') }}</span>
            </p>
          </template>
          <span v-show="!innerclosed" class="body-line" />
        </div>
        <p v-if="!innerclosed && length" class="last-line">
          <span>{{ subfix }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'JsonView',
  props: {
    json: [Object, Array],
    jsonKey: {
      type: String,
      default: ''
    },
    closed: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 13
    }
  },
  data() {
    return {
      innerclosed: true
    }
  },
  computed: {
    isArray() {
      return Object.prototype.toString.call(this.json) === '[object Array]'
    },
    length() {
      return this.isArray ? this.json.length : Object.keys(this.json).length
    },
    subfix() {
      return (this.isArray ? ']' : '}') + (this.isLast ? '' : ',')
    },
    prefix() {
      return this.isArray ? '[' : '{'
    },
    items() {
      if (this.isArray) {
        return this.json.map(item => {
          const isJSON = this.isObjectOrArray(item)
          return {
            value: isJSON ? item : JSON.stringify(item),
            isJSON,
            key: ''
          }
        })
      }
      const json = this.json
      return Object.keys(json).map(key => {
        const item = json[key]
        const isJSON = this.isObjectOrArray(item)
        return {
          value: isJSON ? item : JSON.stringify(item),
          isJSON,
          key
        }
      })
    }
  },
  created() {
    this.innerclosed = this.closed
    this.$watch('closed', () => {
      this.innerclosed = this.closed
    })
  },
  methods: {
    isObjectOrArray(source) {
      const type = Object.prototype.toString.call(source)
      const res = type === '[object Array]' || type === '[object Object]'
      return res
    },
    toggleClose() {
      if (this.innerclosed) {
        this.innerclosed = false
      } else {
        this.innerclosed = true
      }
    }
  }
}
</script>
<style>
  .bgView {
    background-color: #fafafa;
  }

  .json-view {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    /* white-space: nowrap; */
    padding: 0 20px;
    box-sizing: border-box;
    line-height: 30px;
  }

  .json-note {
    color: #909399;
  }

  .json-key {
    color: rgb(147, 98, 15);
  }

  .json-value {
    color: rgb(24, 186, 24);
  }

  .json-item {
    margin: 0;
    padding-left: 20px;
  }

  .first-line {
    padding: 0;
    margin: 0;
  }

  .json-body {
    position: relative;
    padding: 0;
    margin: 0;
  }

  .json-body .body-line {
    position: absolute;
    height: 100%;
    width: 0;
    border-left: dashed 1px #bbb;
    top: 0;
    left: 2px;
  }

  .last-line {
    padding: 0;
    margin: 0;
  }

  .angle {
    position: absolute;
    display: block;
    cursor: pointer;
    float: left;
    width: 20px;
    text-align: center;
    left: 0;
  }

  .angle::after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    border-top: solid 4px #333;
    border-left: solid 6px transparent;
    border-right: solid 6px transparent;
  }

  .angle.closed::after {
    border-left: solid 4px #333;
    border-top: solid 6px transparent;
    border-bottom: solid 6px transparent;
  }
</style>
