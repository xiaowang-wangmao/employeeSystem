<template>
  <div>
    <a-descriptions title="Leave Info" bordered>
    <a-descriptions-item label="全年可享用休假" :span="2">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="已使用休假" >Prepaid</a-descriptions-item>
    <a-descriptions-item label="已批准但未使用休假">YES</a-descriptions-item>
    <a-descriptions-item label="剩余调休">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="剩余年假" :span="2">2019-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="休事假">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="休病假">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="其他假">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="Status" :span="5">
      <a-badge status="processing" text="Running" />
    </a-descriptions-item>
    <a-descriptions-item label="Config Info">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1
      <br />
    </a-descriptions-item>
  </a-descriptions>

  <a-space>
    <a-button type="primary">休假历史</a-button>
  </a-space>
  </div>
</template>

<script lang="ts"></script>
