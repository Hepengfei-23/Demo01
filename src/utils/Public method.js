import axios from 'axios'
export default {
  // path 路径  params 参数对象   status 状态码
  httpGet: async function (path, params, status) {
    const { data: res } = await axios.get(path, params)
    if (res.meta.status !== status) return this.$message.error('获取数据失败')
    return res.data
  },
  httpPost: async function (path, params, status) {
    const { data: res } = await axios.post(path, params)
    if (res.meta.status !== status) return this.$message.error('获取数据失败')
  },
  httpPut: async function (path, params, status) {
    const { data: res } = await axios.put(path, params)
    if (res.meta.status !== status) return this.$message.error('获取数据失败')
  },
  httpDelete: async function (path, params, status) {
    const { data: res } = await axios.delete(path, params)
    if (res.meta.status !== status) return this.$message.error('获取数据失败')
  }
}
