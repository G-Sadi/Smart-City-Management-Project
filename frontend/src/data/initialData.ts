// Auto-generated bundled CivicGrid municipal dataset for standalone / GitHub Pages execution
export const rawAgencies = [
  {
    "code": "LGED",
    "name": "Local Government Engineering Department",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing infrastructure projects at the local level, including roads, bridges, and water supply systems"
  },
  {
    "code": "RDA",
    "name": "Rural Development Academy",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing rural development projects, including agricultural extension and income generation programs"
  },
  {
    "code": "BREB",
    "name": "Bangladesh Rural Electrification Board",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing rural electrification projects in Bangladesh"
  },
  {
    "code": "BWDB",
    "name": "Bangladesh Water Development Board",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing water development projects, including water treatment plants and irrigation systems"
  },
  {
    "code": "BPDB",
    "name": "Bangladesh Power Development Board",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing power generation, transmission, and distribution projects in Bangladesh"
  },
  {
    "code": "BTRC",
    "name": "Bangladesh Telecommunication Regulatory Commission",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing telecommunications projects in Bangladesh, including the expansion of mobile and internet networks"
  },
  {
    "code": "BBA",
    "name": "Bangladesh Bridge Authority",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing bridge construction and maintenance projects in Bangladesh"
  },
  {
    "code": "PWD",
    "name": "Bangladesh Public Works Department",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing infrastructure projects at the national level, including roads, bridges, and buildings"
  },
  {
    "code": "LGD",
    "name": "Local Government Division",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing local government projects and programs, including the development of community facilities and services"
  },
  {
    "code": "MOEDU",
    "name": "Ministry of Education",
    "type": "EXEC",
    "description": "Executing agency responsible for implementing education projects and programs, including the construction of new schools and classrooms"
  },
  {
    "code": "ECNEC",
    "name": "Executive Committee of the National Economic Council",
    "type": "APPROV",
    "description": "Approving committee for projects costing over BDT 50 crores"
  },
  {
    "code": "MOP",
    "name": "Ministry of Planning",
    "type": "APPROV",
    "description": "Approving committee for projects costing up to BDT 50 crores"
  }
];

export const rawConstraints = [
  {
    "code": "MOEDU",
    "max_limit": "25",
    "constraint_type": "executing_agency_limit"
  },
  {
    "code": "LGD",
    "max_limit": "75",
    "constraint_type": "executing_agency_limit"
  },
  {
    "code": "Daudpur",
    "max_limit": "8",
    "constraint_type": "location_limit"
  },
  {
    "code": "Kanchan",
    "max_limit": "5",
    "constraint_type": "location_limit"
  },
  {
    "code": "Pabna",
    "max_limit": "1",
    "constraint_type": "location_limit"
  },
  {
    "code": "PWD",
    "max_limit": "500",
    "constraint_type": "yearly_funding"
  },
  {
    "code": "LGD",
    "max_limit": "1000",
    "constraint_type": "yearly_funding"
  }
];

export const rawProjects = [
  {
    "name": "Uttar Khaishayir Government Primary School",
    "location": "Daudpur",
    "latitude": "23.61931959",
    "longitude": "90.50365683",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj9280",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-02",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Uttar Khaishayir General Hospital",
    "location": "Daudpur",
    "latitude": "23.61931959",
    "longitude": "90.50365683",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "proj9681",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-12-26",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Fazlul Rahman Memorial General Hospital",
    "location": "Tarabo",
    "latitude": "23.71440803",
    "longitude": "90.51711917",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "proj3281",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-03-10",
    "completion": "15.62",
    "actual_cost": "3.9"
  },
  {
    "name": "Noapara Government Primary School",
    "location": "Tarabo",
    "latitude": "23.7293586",
    "longitude": "90.5089105",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj4207",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-17",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Noapara General Hospital",
    "location": "Tarabo",
    "latitude": "23.7293586",
    "longitude": "90.5089105",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "proj9465",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-11-04",
    "completion": "22.52",
    "actual_cost": "3.38"
  },
  {
    "name": "Noapara Community Park",
    "location": "Tarabo",
    "latitude": "23.7293586",
    "longitude": "90.5089105",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj2754",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-09",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "No. 79 Barpa General Hospital",
    "location": "Tarabo",
    "latitude": "23.7469498",
    "longitude": "90.5417278",
    "exec": "LGD",
    "cost": "9",
    "timespan": "5",
    "project_id": "proj5283",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-05",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "No. 74 Mashabo Government Primary School",
    "location": "Tarabo",
    "latitude": "23.7488533",
    "longitude": "90.553965",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj4588",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-03",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "No. 74 Mashabo Community Park",
    "location": "Tarabo",
    "latitude": "23.7488533",
    "longitude": "90.553965",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj3724",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-10-17",
    "completion": "17.53",
    "actual_cost": "0.35"
  },
  {
    "name": "No. 56 Horgaon Community Park",
    "location": "Golakandail",
    "latitude": "23.7764662",
    "longitude": "90.5933341",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj4968",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-13",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Paboi Government Primary School",
    "location": "Murapara",
    "latitude": "23.7812657",
    "longitude": "90.5321705",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj1080",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-12",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Paboi General Hospital",
    "location": "Murapara",
    "latitude": "23.7812657",
    "longitude": "90.5321705",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "proj3173",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-12-20",
    "completion": "20",
    "actual_cost": "3"
  },
  {
    "name": "Paboi Community Park",
    "location": "Murapara",
    "latitude": "23.7812657",
    "longitude": "90.5321705",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj8114",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-12-10",
    "completion": "2.74",
    "actual_cost": "0.05"
  },
  {
    "name": "Masumabad Government Primary School",
    "location": "Bhulta",
    "latitude": "23.799557",
    "longitude": "90.5448202",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj2485",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-10-08",
    "completion": "6.67",
    "actual_cost": "0.07"
  },
  {
    "name": "No. 26 Naora Government Primary School",
    "location": "Kayetpara",
    "latitude": "23.8017158",
    "longitude": "90.492804",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj9736",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-12-30",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Kushabo Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8066314",
    "longitude": "90.5701778",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj1810",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-06-10",
    "completion": "17.63",
    "actual_cost": "0.53"
  },
  {
    "name": "Kushabo Community Park",
    "location": "Kanchan",
    "latitude": "23.8066314",
    "longitude": "90.5701778",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj6981",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-11-15",
    "completion": "9.59",
    "actual_cost": "0.19"
  },
  {
    "name": "Jahangir General Hospital",
    "location": "Rupganj",
    "latitude": "23.8091655",
    "longitude": "90.5358279",
    "exec": "LGD",
    "cost": "9",
    "timespan": "5",
    "project_id": "proj3316",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-04-06",
    "completion": "14.14",
    "actual_cost": "1.27"
  },
  {
    "name": "Jahangir Community Park",
    "location": "Rupganj",
    "latitude": "23.8091655",
    "longitude": "90.5358279",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj7726",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-11-06",
    "completion": "12.05",
    "actual_cost": "0.12"
  },
  {
    "name": "Atlashpur General Hospital",
    "location": "Bhulta",
    "latitude": "23.8114074",
    "longitude": "90.5474247",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "proj4907",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-07",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Kajigochh General Hospital",
    "location": "Shalbahan",
    "latitude": "23.81165412",
    "longitude": "90.41992933",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "proj4048",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-13",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Hatabo Government Primary School",
    "location": "Kanchan",
    "latitude": "23.81429356",
    "longitude": "90.55622879",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj1430",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-12",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Hatabo General Hospital",
    "location": "Kanchan",
    "latitude": "23.81429356",
    "longitude": "90.55622879",
    "exec": "LGD",
    "cost": "22",
    "timespan": "5",
    "project_id": "proj4932",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-07-22",
    "completion": "8.27",
    "actual_cost": "1.82"
  },
  {
    "name": "Hatabo Community Park",
    "location": "Kanchan",
    "latitude": "23.81429356",
    "longitude": "90.55622879",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj8071",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-07-03",
    "completion": "46.58",
    "actual_cost": "0.93"
  },
  {
    "name": "Harinda Community Park",
    "location": "Rupganj",
    "latitude": "23.8178692",
    "longitude": "90.5385196",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj1759",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-06-07",
    "completion": "100",
    "actual_cost": "3.07"
  },
  {
    "name": "Agarpara Government Primary School",
    "location": "Rupganj",
    "latitude": "23.82537587",
    "longitude": "90.52254964",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj4893",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-10-27",
    "completion": "38.26",
    "actual_cost": "1.15"
  },
  {
    "name": "Agarpara Community Park",
    "location": "Rupganj",
    "latitude": "23.82537587",
    "longitude": "90.52254964",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj5028",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-02-18",
    "completion": "83.56",
    "actual_cost": "0.84"
  },
  {
    "name": "Pitalganj Community Park",
    "location": "Rupganj",
    "latitude": "23.8259202",
    "longitude": "90.5530399",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj5163",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-04-24",
    "completion": "65.75",
    "actual_cost": "1.31"
  },
  {
    "name": "Gowal Para Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8276418",
    "longitude": "90.5030257",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj1587",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-13",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Gowal Para General Hospital",
    "location": "Rupganj",
    "latitude": "23.8276418",
    "longitude": "90.5030257",
    "exec": "LGD",
    "cost": "24",
    "timespan": "5",
    "project_id": "proj4224",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-10-13",
    "completion": "23.73",
    "actual_cost": "5.7"
  },
  {
    "name": "Gowal Para Community Park",
    "location": "Rupganj",
    "latitude": "23.8276418",
    "longitude": "90.5030257",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj7787",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-11-07",
    "completion": "84",
    "actual_cost": "2.24"
  },
  {
    "name": "Kanchan General Hospital",
    "location": "Kanchan",
    "latitude": "23.8316428",
    "longitude": "90.558248",
    "exec": "LGD",
    "cost": "24",
    "timespan": "5",
    "project_id": "proj3971",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-11",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Pitalganj Brahmankhali Government Primary School",
    "location": "Rupganj",
    "latitude": "23.83284605",
    "longitude": "90.54201074",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj7880",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-12-31",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Pitalganj Brahmankhali General Hospital",
    "location": "Rupganj",
    "latitude": "23.83284605",
    "longitude": "90.54201074",
    "exec": "LGD",
    "cost": "14",
    "timespan": "5",
    "project_id": "proj7688",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-07-17",
    "completion": "28.55",
    "actual_cost": "4"
  },
  {
    "name": "Pitalganj Brahmankhali Community Park",
    "location": "Rupganj",
    "latitude": "23.83284605",
    "longitude": "90.54201074",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj6340",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-08-27",
    "completion": "31.51",
    "actual_cost": "0.63"
  },
  {
    "name": "Yusufganj Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8346268",
    "longitude": "90.4883393",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj5660",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-02-06",
    "completion": "28.95",
    "actual_cost": "1.16"
  },
  {
    "name": "Gutiabo Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8352253",
    "longitude": "90.5276705",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj4979",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-08-09",
    "completion": "12.15",
    "actual_cost": "0.36"
  },
  {
    "name": "Gutiabo General Hospital",
    "location": "Rupganj",
    "latitude": "23.8352253",
    "longitude": "90.5276705",
    "exec": "LGD",
    "cost": "7",
    "timespan": "5",
    "project_id": "proj3331",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-02-15",
    "completion": "16.88",
    "actual_cost": "1.18"
  },
  {
    "name": "Kenduapara Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8353554",
    "longitude": "90.5554791",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj1227",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-04-12",
    "completion": "23.01",
    "actual_cost": "0.69"
  },
  {
    "name": "Kenduapara General Hospital",
    "location": "Kanchan",
    "latitude": "23.8353554",
    "longitude": "90.5554791",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "proj6752",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-12-22",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Chowdhurypara Community Park",
    "location": "Kanchan",
    "latitude": "23.8363742",
    "longitude": "90.5696117",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj5060",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-09",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Poshi Harar Bari Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8385501",
    "longitude": "90.4902048",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj5731",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-05-03",
    "completion": "21.1",
    "actual_cost": "1.06"
  },
  {
    "name": "Poshi Harar Bari General Hospital",
    "location": "Rupganj",
    "latitude": "23.8385501",
    "longitude": "90.4902048",
    "exec": "LGD",
    "cost": "7",
    "timespan": "5",
    "project_id": "proj5233",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-12-02",
    "completion": "20.99",
    "actual_cost": "1.47"
  },
  {
    "name": "No. 40 Kortia Pubergaon Government Primary School",
    "location": "Bholabo",
    "latitude": "23.84080923",
    "longitude": "90.58791205",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj8315",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-10-02",
    "completion": "40.55",
    "actual_cost": "2.03"
  },
  {
    "name": "Ranipura Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8414317",
    "longitude": "90.5716043",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj2607",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-04-30",
    "completion": "21.37",
    "actual_cost": "0.64"
  },
  {
    "name": "Ranipura General Hospital",
    "location": "Kanchan",
    "latitude": "23.8414317",
    "longitude": "90.5716043",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "proj3213",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-16",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Birabo Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8569547",
    "longitude": "90.5536643",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj8573",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-11",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Birabo General Hospital",
    "location": "Kanchan",
    "latitude": "23.8569547",
    "longitude": "90.5536643",
    "exec": "LGD",
    "cost": "23",
    "timespan": "5",
    "project_id": "proj8106",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-10-18",
    "completion": "3.45",
    "actual_cost": "0.79"
  },
  {
    "name": "Taroil General Hospital",
    "location": "Kanchan",
    "latitude": "23.8639508",
    "longitude": "90.5646438",
    "exec": "LGD",
    "cost": "9",
    "timespan": "5",
    "project_id": "proj5458",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-16",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Taroil Community Park",
    "location": "Kanchan",
    "latitude": "23.8639508",
    "longitude": "90.5646438",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj3407",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-06-26",
    "completion": "48.49",
    "actual_cost": "0.97"
  },
  {
    "name": "Hirnal General Hospital",
    "location": "Daudpur",
    "latitude": "23.8641457",
    "longitude": "90.4105208",
    "exec": "LGD",
    "cost": "10",
    "timespan": "5",
    "project_id": "proj5197",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-12-27",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Hirnal Community Park",
    "location": "Daudpur",
    "latitude": "23.8641457",
    "longitude": "90.4105208",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj5810",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-05-10",
    "completion": "100",
    "actual_cost": "3.23"
  },
  {
    "name": "Taroil Birabo General Hospital",
    "location": "Kanchan",
    "latitude": "23.865362",
    "longitude": "90.5619884",
    "exec": "LGD",
    "cost": "9",
    "timespan": "5",
    "project_id": "proj9522",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-12-24",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Taroil Birabo Community Park",
    "location": "Kanchan",
    "latitude": "23.865362",
    "longitude": "90.5619884",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj5373",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-04-18",
    "completion": "67.4",
    "actual_cost": "1.35"
  },
  {
    "name": "Jinda General Hospital",
    "location": "Daudpur",
    "latitude": "23.8709465",
    "longitude": "90.5207756",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "proj6241",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-08-16",
    "completion": "6.9",
    "actual_cost": "1.73"
  },
  {
    "name": "Jinda Community Park",
    "location": "Daudpur",
    "latitude": "23.8709465",
    "longitude": "90.5207756",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj9906",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-14",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Boilda General Hospital",
    "location": "Daudpur",
    "latitude": "23.8768134",
    "longitude": "90.5353583",
    "exec": "LGD",
    "cost": "16",
    "timespan": "5",
    "project_id": "proj2298",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-06-08",
    "completion": "10.68",
    "actual_cost": "1.71"
  },
  {
    "name": "Boilda Community Park",
    "location": "Daudpur",
    "latitude": "23.8768134",
    "longitude": "90.5353583",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj8160",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-12-23",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "No. 37 Bholabo Government Primary School",
    "location": "Bholabo",
    "latitude": "23.8779349",
    "longitude": "90.5878684",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj9843",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-10-12",
    "completion": "6.3",
    "actual_cost": "0.19"
  },
  {
    "name": "No. 37 Bholabo General Hospital",
    "location": "Bholabo",
    "latitude": "23.8779349",
    "longitude": "90.5878684",
    "exec": "LGD",
    "cost": "13",
    "timespan": "5",
    "project_id": "proj4482",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-08-26",
    "completion": "26.36",
    "actual_cost": "3.43"
  },
  {
    "name": "Rohila Community Park",
    "location": "Daudpur",
    "latitude": "23.8792481",
    "longitude": "90.553981",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj5770",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-12-15",
    "completion": "92",
    "actual_cost": "1.01"
  },
  {
    "name": "Purbo Daudpur General Hospital",
    "location": "Daudpur",
    "latitude": "23.882795",
    "longitude": "90.5764378",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "proj5838",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-09",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Bholabo Adorsho General Hospital",
    "location": "Bholabo",
    "latitude": "23.88374878",
    "longitude": "90.59371233",
    "exec": "LGD",
    "cost": "12",
    "timespan": "5",
    "project_id": "proj2669",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-04-05",
    "completion": "14.19",
    "actual_cost": "1.7"
  },
  {
    "name": "Daudpur General Hospital",
    "location": "Daudpur",
    "latitude": "23.8878345",
    "longitude": "90.5722163",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "proj3215",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-09-10",
    "completion": "5.53",
    "actual_cost": "0.83"
  },
  {
    "name": "Daudpur Community Park",
    "location": "Daudpur",
    "latitude": "23.8878345",
    "longitude": "90.5722163",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj7747",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-08-11",
    "completion": "35.89",
    "actual_cost": "0.72"
  },
  {
    "name": "Agla Government Primary School",
    "location": "Daudpur",
    "latitude": "23.8915917",
    "longitude": "90.5606133",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj3806",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-12-11",
    "completion": "34.16",
    "actual_cost": "1.37"
  },
  {
    "name": "Bodamoynaguri Community Park",
    "location": "Debnagar",
    "latitude": "26.4204885",
    "longitude": "88.5061948",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj5414",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-12-25",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Khatiagochh Government Primary School",
    "location": "Debnagar",
    "latitude": "26.4473367",
    "longitude": "88.49846",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj7741",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-12-24",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Khatiagochh General Hospital",
    "location": "Debnagar",
    "latitude": "26.4473367",
    "longitude": "88.49846",
    "exec": "LGD",
    "cost": "19",
    "timespan": "5",
    "project_id": "proj8325",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-02-19",
    "completion": "16.66",
    "actual_cost": "3.17"
  },
  {
    "name": "Bhojonpur General Hospital",
    "location": "Bhojonpur",
    "latitude": "26.469149",
    "longitude": "88.483176",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "proj1907",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-01",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Bhojonpur Community Park",
    "location": "Bhojonpur",
    "latitude": "26.469149",
    "longitude": "88.483176",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj1206",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-07-22",
    "completion": "83",
    "actual_cost": "1.41"
  },
  {
    "name": "Jhalingigochh Community Park",
    "location": "Debnagar",
    "latitude": "26.4695022",
    "longitude": "88.4868529",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj2458",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-08-23",
    "completion": "32.6",
    "actual_cost": "0.33"
  },
  {
    "name": "Maaligochh Government Primary School",
    "location": "Bhojonpur",
    "latitude": "26.482545",
    "longitude": "88.4748633",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj6016",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-09-10",
    "completion": "9.22",
    "actual_cost": "0.09"
  },
  {
    "name": "Maaligochh Community Park",
    "location": "Bhojonpur",
    "latitude": "26.482545",
    "longitude": "88.4748633",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj1092",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-06-11",
    "completion": "52.6",
    "actual_cost": "0.53"
  },
  {
    "name": "Majhipara Government Primary School",
    "location": "Shalbahan",
    "latitude": "26.4834629",
    "longitude": "88.421677",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj5547",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-10-23",
    "completion": "38.63",
    "actual_cost": "0.39"
  },
  {
    "name": "Majhipara Community Park",
    "location": "Shalbahan",
    "latitude": "26.4834629",
    "longitude": "88.421677",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj5879",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-12-25",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Ajeej Nagar Government Primary School",
    "location": "Tetulia",
    "latitude": "26.48788874",
    "longitude": "88.36001292",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj4849",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-12-22",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Ajeej Nagar Community Park",
    "location": "Tetulia",
    "latitude": "26.48788874",
    "longitude": "88.36001292",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj3778",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-06-15",
    "completion": "100",
    "actual_cost": "1.52"
  },
  {
    "name": "Aamjuani Government Primary School",
    "location": "Debnagar",
    "latitude": "26.4897783",
    "longitude": "88.5119467",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj2387",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-01-26",
    "completion": "29.95",
    "actual_cost": "0.6"
  },
  {
    "name": "Aamjuani Community Park",
    "location": "Debnagar",
    "latitude": "26.4897783",
    "longitude": "88.5119467",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj5580",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-03-28",
    "completion": "73.15",
    "actual_cost": "0.73"
  },
  {
    "name": "Jaamriguri Government Primary School",
    "location": "Shalbahan",
    "latitude": "26.4910106",
    "longitude": "88.396602",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj9285",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-04",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Jaamriguri Community Park",
    "location": "Shalbahan",
    "latitude": "26.4910106",
    "longitude": "88.396602",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj9956",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-11-01",
    "completion": "97",
    "actual_cost": "1.13"
  },
  {
    "name": "Bowalmaari General Hospital",
    "location": "Shalbahan",
    "latitude": "26.4928829",
    "longitude": "88.3382535",
    "exec": "LGD",
    "cost": "14",
    "timespan": "5",
    "project_id": "proj8269",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-10-18",
    "completion": "3.45",
    "actual_cost": "0.48"
  },
  {
    "name": "Bowalmaari Community Park",
    "location": "Shalbahan",
    "latitude": "26.4928829",
    "longitude": "88.3382535",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj8816",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-12",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Boiragigochh General Hospital",
    "location": "Bhojonpur",
    "latitude": "26.4940049",
    "longitude": "88.4721835",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "proj9488",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-04",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Boiragigochh Community Park",
    "location": "Bhojonpur",
    "latitude": "26.4940049",
    "longitude": "88.4721835",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj9145",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-03",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Kalandigochh Community Park",
    "location": "Shalbahan",
    "latitude": "26.4959354",
    "longitude": "88.3880342",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj3469",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-04",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Tetulia Model Government Primary School",
    "location": "Tetulia",
    "latitude": "26.49784",
    "longitude": "88.33755",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj5145",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-07-31",
    "completion": "12.97",
    "actual_cost": "0.26"
  },
  {
    "name": "Tetulia Model General Hospital",
    "location": "Tetulia",
    "latitude": "26.49784",
    "longitude": "88.33755",
    "exec": "LGD",
    "cost": "19",
    "timespan": "5",
    "project_id": "proj6393",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-19",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Shibchondi Government Primary School",
    "location": "Debnagar",
    "latitude": "26.49840733",
    "longitude": "88.50178946",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj4919",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-12-27",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Shibchondi General Hospital",
    "location": "Debnagar",
    "latitude": "26.49840733",
    "longitude": "88.50178946",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "proj5951",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-07-19",
    "completion": "8.44",
    "actual_cost": "0.42"
  },
  {
    "name": "Shibchondi Community Park",
    "location": "Debnagar",
    "latitude": "26.49840733",
    "longitude": "88.50178946",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj1718",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-11-17",
    "completion": "9.04",
    "actual_cost": "0.18"
  },
  {
    "name": "Mathafata Community Park",
    "location": "Tetulia",
    "latitude": "26.50265452",
    "longitude": "88.37025024",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj4900",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-04-03",
    "completion": "71.51",
    "actual_cost": "0.72"
  },
  {
    "name": "Nondogochh General Hospital",
    "location": "Debnagar",
    "latitude": "26.5030717",
    "longitude": "88.510585",
    "exec": "LGD",
    "cost": "8",
    "timespan": "5",
    "project_id": "proj5711",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-12-23",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Nondogochh Community Park",
    "location": "Debnagar",
    "latitude": "26.5030717",
    "longitude": "88.510585",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj3120",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-05-14",
    "completion": "100",
    "actual_cost": "1.6"
  },
  {
    "name": "Boro Duliagochh Government Primary School",
    "location": "Shalbahan",
    "latitude": "26.5083906",
    "longitude": "88.38943675",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "proj3348",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-11-06",
    "completion": "4.02",
    "actual_cost": "0.16"
  },
  {
    "name": "Boro Duliagochh General Hospital",
    "location": "Shalbahan",
    "latitude": "26.5083906",
    "longitude": "88.38943675",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "proj1181",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-10",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Geetalgoch Government Primary School",
    "location": "Bhojonpur",
    "latitude": "26.5086811",
    "longitude": "88.4719455",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "proj1106",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-11-03",
    "completion": "4.29",
    "actual_cost": "0.13"
  },
  {
    "name": "Geetalgoch Community Park",
    "location": "Bhojonpur",
    "latitude": "26.5086811",
    "longitude": "88.4719455",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj3490",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-02",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Bhodesshor General Hospital",
    "location": "Bhojonpur",
    "latitude": "26.51410659",
    "longitude": "88.48702256",
    "exec": "LGD",
    "cost": "11",
    "timespan": "5",
    "project_id": "proj8293",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-01-16",
    "completion": "18.52",
    "actual_cost": "2.04"
  },
  {
    "name": "Khalpara General Hospital",
    "location": "Tetulia",
    "latitude": "26.5162188",
    "longitude": "88.3886477",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "proj4903",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2023-01-05",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Khalpara Community Park",
    "location": "Tetulia",
    "latitude": "26.5162188",
    "longitude": "88.3886477",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj5450",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-10-30",
    "completion": "93",
    "actual_cost": "2.28"
  },
  {
    "name": "Gowabari Government Primary School",
    "location": "Tetulia",
    "latitude": "26.525549",
    "longitude": "88.3691627",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj6242",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-12-30",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Gowabari General Hospital",
    "location": "Tetulia",
    "latitude": "26.525549",
    "longitude": "88.3691627",
    "exec": "LGD",
    "cost": "22",
    "timespan": "5",
    "project_id": "proj5114",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-03-16",
    "completion": "15.29",
    "actual_cost": "3.36"
  },
  {
    "name": "Gowabari Community Park",
    "location": "Tetulia",
    "latitude": "26.525549",
    "longitude": "88.3691627",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj4135",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-12-29",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Lohokachi Government Primary School",
    "location": "Shalbahan",
    "latitude": "26.530352",
    "longitude": "88.4092735",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj8267",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-19",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Ronochondi Government Primary School",
    "location": "Tetulia",
    "latitude": "26.5324052",
    "longitude": "88.3649777",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj8932",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-07-12",
    "completion": "48.04",
    "actual_cost": "2.4"
  },
  {
    "name": "Ronochondi Community Park",
    "location": "Tetulia",
    "latitude": "26.5324052",
    "longitude": "88.3649777",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj7575",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-10-31",
    "completion": "13.7",
    "actual_cost": "0.14"
  },
  {
    "name": "Islampur Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.5369314",
    "longitude": "88.3659623",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj8961",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-11-16",
    "completion": "36.44",
    "actual_cost": "0.73"
  },
  {
    "name": "Bholajoat Community Park",
    "location": "Tirnoihat",
    "latitude": "26.5372393",
    "longitude": "88.393252",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj7969",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-12-23",
    "completion": "99.18",
    "actual_cost": "0.99"
  },
  {
    "name": "Abdul Hakim & Abdul Motin Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.541235",
    "longitude": "88.387245",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "proj2422",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2023-01-09",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Khoykhaatpara Community Park",
    "location": "Tirnoihat",
    "latitude": "26.5524062",
    "longitude": "88.37556671",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj7301",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-08-08",
    "completion": "93",
    "actual_cost": "1.37"
  },
  {
    "name": "Fokirpara Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.5540509",
    "longitude": "88.396669",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "proj1233",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2022-08-27",
    "completion": "10.5",
    "actual_cost": "0.53"
  },
  {
    "name": "Fokirpara General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.5540509",
    "longitude": "88.396669",
    "exec": "LGD",
    "cost": "7",
    "timespan": "5",
    "project_id": "proj2357",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-10-15",
    "completion": "23.62",
    "actual_cost": "1.65"
  },
  {
    "name": "Fokirpara Community Park",
    "location": "Tirnoihat",
    "latitude": "26.5540509",
    "longitude": "88.396669",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj5020",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2023-01-02",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Mondolpara General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.55872",
    "longitude": "88.426121",
    "exec": "LGD",
    "cost": "20",
    "timespan": "5",
    "project_id": "proj3936",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-11-02",
    "completion": "22.63",
    "actual_cost": "4.53"
  },
  {
    "name": "Gowalgoch Government Primary School",
    "location": "Banglabandha",
    "latitude": "26.5788339",
    "longitude": "88.38756893",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "proj4988",
    "goal": "Extending education facilities to the neighborhood",
    "start_date": "2021-10-30",
    "completion": "37.99",
    "actual_cost": "0.38"
  },
  {
    "name": "Gowalgoch General Hospital",
    "location": "Banglabandha",
    "latitude": "26.5788339",
    "longitude": "88.38756893",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "proj2090",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2022-12-23",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Gowalgoch Community Park",
    "location": "Banglabandha",
    "latitude": "26.5788339",
    "longitude": "88.38756893",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "proj6294",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2022-10-23",
    "completion": "15.89",
    "actual_cost": "0.32"
  },
  {
    "name": "Sipaipara General Hospital",
    "location": "Banglabandha",
    "latitude": "26.5886617",
    "longitude": "88.3946118",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "proj7823",
    "goal": "Extending healthcare facilities to the neighborhood",
    "start_date": "2021-09-14",
    "completion": "25.32",
    "actual_cost": "1.27"
  },
  {
    "name": "Sipaipara Community Park",
    "location": "Banglabandha",
    "latitude": "26.5886617",
    "longitude": "88.3946118",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "proj9099",
    "goal": "Extending recreational facilities to the neighborhood",
    "start_date": "2021-10-15",
    "completion": "97",
    "actual_cost": "1.18"
  },
  {
    "name": "Mirkadim Bridge",
    "location": "Mirkadim",
    "latitude": "23.548083",
    "longitude": "90.47725",
    "exec": "BBA",
    "cost": "1050",
    "timespan": "5",
    "project_id": "proj1235",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2022-12-23",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Kalurghat Bridge",
    "location": "Chittagong",
    "latitude": "22.395861",
    "longitude": "91.888944",
    "exec": "LGED",
    "cost": "1320",
    "timespan": "5",
    "project_id": "proj3072",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2022-02-14",
    "completion": "16.93",
    "actual_cost": "223.48"
  },
  {
    "name": "Keane Bridge",
    "location": "Sylhet",
    "latitude": "24.887556",
    "longitude": "91.868",
    "exec": "LGED",
    "cost": "1130",
    "timespan": "5",
    "project_id": "proj9303",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2023-01-10",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Lalon Shah Bridge",
    "location": "Pabna,Kushtia",
    "latitude": "24.065167",
    "longitude": "89.029556",
    "exec": "LGED",
    "cost": "1930",
    "timespan": "5",
    "project_id": "proj5852",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2021-11-07",
    "completion": "22.36",
    "actual_cost": "431.55"
  },
  {
    "name": "Pabna-Kushtia Link Road",
    "location": "Pabna,Kushtia",
    "latitude": "24.065167",
    "longitude": "89.029556",
    "exec": "PWD",
    "cost": "120",
    "timespan": "5",
    "project_id": "proj7024",
    "goal": "Improving structural strength of the road",
    "start_date": "2023-01-06",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Kishoreganj-Brahmanbaria Link Road",
    "location": "Kishoreganj,Brahmanbaria",
    "latitude": "24.044611",
    "longitude": "90.995778",
    "exec": "PWD",
    "cost": "360",
    "timespan": "5",
    "project_id": "proj5730",
    "goal": "Improving structural strength of the road",
    "start_date": "2021-06-19",
    "completion": "30.08",
    "actual_cost": "108.29"
  },
  {
    "name": "Shah Amanat Bridge",
    "location": "Chittagong",
    "latitude": "22.3253",
    "longitude": "91.8532",
    "exec": "PWD",
    "cost": "2200",
    "timespan": "5",
    "project_id": "proj4716",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2023-01-17",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Barisal-Patuakhali Link Road",
    "location": "Barisal,Patuakhali",
    "latitude": "22.465417",
    "longitude": "90.341083",
    "exec": "LGED",
    "cost": "150",
    "timespan": "5",
    "project_id": "proj8626",
    "goal": "Improving structural strength of the road",
    "start_date": "2023-01-17",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Asmat Ali Khan Bridge 7th Bangladesh-China Friendship Bridge",
    "location": "Madaripur",
    "latitude": "23.169639",
    "longitude": "90.237556",
    "exec": "PWD",
    "cost": "2270",
    "timespan": "5",
    "project_id": "proj6782",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2022-12-29",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Kanchpur Bridge",
    "location": "Narayanganj",
    "latitude": "23.703278",
    "longitude": "90.517611",
    "exec": "PWD",
    "cost": "1620",
    "timespan": "5",
    "project_id": "proj5876",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2021-07-25",
    "completion": "28.11",
    "actual_cost": "455.38"
  },
  {
    "name": "Meghna Bridge 1st Bangladesh-Japan Friendship Bridge",
    "location": "Narayanganj",
    "latitude": "23.605972",
    "longitude": "90.613944",
    "exec": "BBA",
    "cost": "1350",
    "timespan": "5",
    "project_id": "proj1644",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2023-01-03",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Gumti Bridge",
    "location": "Munshiganj",
    "latitude": "23.53025",
    "longitude": "90.702222",
    "exec": "LGED",
    "cost": "2080",
    "timespan": "5",
    "project_id": "proj7221",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2023-01-02",
    "completion": "0",
    "actual_cost": "0"
  },
  {
    "name": "Mahananda Bridge 3th Bangladesh-China Friendship Bridge",
    "location": "Munshiganj",
    "latitude": "23.569528",
    "longitude": "90.512389",
    "exec": "LGED",
    "cost": "820",
    "timespan": "5",
    "project_id": "proj1655",
    "goal": "Improving structural strength of the bridge",
    "start_date": "2021-11-30",
    "completion": "21.1",
    "actual_cost": "173.02"
  }
];

export const rawProposals = [
  {
    "name": "Uttar Khaishayir Community Park",
    "location": "Daudpur",
    "latitude": "23.61931959",
    "longitude": "90.50365683",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop3072",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Fazlul Rahman Memorial Government Primary School",
    "location": "Tarabo",
    "latitude": "23.71440803",
    "longitude": "90.51711917",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop7106",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Fazlul Rahman Memorial Community Park",
    "location": "Tarabo",
    "latitude": "23.71440803",
    "longitude": "90.51711917",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop5730",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 79 Barpa Government Primary School",
    "location": "Tarabo",
    "latitude": "23.7469498",
    "longitude": "90.5417278",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "prop7655",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 79 Barpa Community Park",
    "location": "Tarabo",
    "latitude": "23.7469498",
    "longitude": "90.5417278",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop2195",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 74 Mashabo General Hospital",
    "location": "Tarabo",
    "latitude": "23.7488533",
    "longitude": "90.553965",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "prop1114",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 73 Kornogop Government Primary School",
    "location": "Tarabo",
    "latitude": "23.7581847",
    "longitude": "90.5380161",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop8384",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 73 Kornogop General Hospital",
    "location": "Tarabo",
    "latitude": "23.7581847",
    "longitude": "90.5380161",
    "exec": "LGD",
    "cost": "19",
    "timespan": "5",
    "project_id": "prop4513",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 73 Kornogop Community Park",
    "location": "Tarabo",
    "latitude": "23.7581847",
    "longitude": "90.5380161",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop4527",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 56 Horgaon Government Primary School",
    "location": "Golakandail",
    "latitude": "23.7764662",
    "longitude": "90.5933341",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop5719",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 56 Horgaon General Hospital",
    "location": "Golakandail",
    "latitude": "23.7764662",
    "longitude": "90.5933341",
    "exec": "LGD",
    "cost": "6",
    "timespan": "5",
    "project_id": "prop5391",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Aukhabo Government Primary School",
    "location": "Bhulta",
    "latitude": "23.7772222",
    "longitude": "90.5621962",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop8439",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Aukhabo General Hospital",
    "location": "Bhulta",
    "latitude": "23.7772222",
    "longitude": "90.5621962",
    "exec": "LGD",
    "cost": "10",
    "timespan": "5",
    "project_id": "prop9756",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Aukhabo Community Park",
    "location": "Bhulta",
    "latitude": "23.7772222",
    "longitude": "90.5621962",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop2763",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 28 Kamshire Government Primary School",
    "location": "Kayetpara",
    "latitude": "23.7824021",
    "longitude": "90.4800507",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop2863",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 28 Kamshire General Hospital",
    "location": "Kayetpara",
    "latitude": "23.7824021",
    "longitude": "90.4800507",
    "exec": "LGD",
    "cost": "23",
    "timespan": "5",
    "project_id": "prop6579",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 28 Kamshire Community Park",
    "location": "Kayetpara",
    "latitude": "23.7824021",
    "longitude": "90.4800507",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop5951",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Masumabad General Hospital",
    "location": "Bhulta",
    "latitude": "23.799557",
    "longitude": "90.5448202",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "prop3904",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Masumabad Community Park",
    "location": "Bhulta",
    "latitude": "23.799557",
    "longitude": "90.5448202",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop8029",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 26 Naora General Hospital",
    "location": "Kayetpara",
    "latitude": "23.8017158",
    "longitude": "90.492804",
    "exec": "LGD",
    "cost": "19",
    "timespan": "5",
    "project_id": "prop1397",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 26 Naora Community Park",
    "location": "Kayetpara",
    "latitude": "23.8017158",
    "longitude": "90.492804",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop9060",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kushabo General Hospital",
    "location": "Kanchan",
    "latitude": "23.8066314",
    "longitude": "90.5701778",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "prop6058",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Jahangir Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8091655",
    "longitude": "90.5358279",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop8947",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Atlashpur Government Primary School",
    "location": "Bhulta",
    "latitude": "23.8114074",
    "longitude": "90.5474247",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop4357",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Atlashpur Community Park",
    "location": "Bhulta",
    "latitude": "23.8114074",
    "longitude": "90.5474247",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop1518",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kajigochh Government Primary School",
    "location": "Shalbahan",
    "latitude": "23.81165412",
    "longitude": "90.41992933",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "prop7875",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kajigochh Community Park",
    "location": "Shalbahan",
    "latitude": "23.81165412",
    "longitude": "90.41992933",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop4964",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Harinda Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8178692",
    "longitude": "90.5385196",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop6967",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Harinda General Hospital",
    "location": "Rupganj",
    "latitude": "23.8178692",
    "longitude": "90.5385196",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "prop9012",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kolatoli Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8243871",
    "longitude": "90.5735424",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop3771",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kolatoli General Hospital",
    "location": "Kanchan",
    "latitude": "23.8243871",
    "longitude": "90.5735424",
    "exec": "LGD",
    "cost": "13",
    "timespan": "5",
    "project_id": "prop6954",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kolatoli Community Park",
    "location": "Kanchan",
    "latitude": "23.8243871",
    "longitude": "90.5735424",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop1387",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Agarpara General Hospital",
    "location": "Rupganj",
    "latitude": "23.82537587",
    "longitude": "90.52254964",
    "exec": "LGD",
    "cost": "22",
    "timespan": "5",
    "project_id": "prop7523",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Pitalganj Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8259202",
    "longitude": "90.5530399",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop6974",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Pitalganj General Hospital",
    "location": "Rupganj",
    "latitude": "23.8259202",
    "longitude": "90.5530399",
    "exec": "LGD",
    "cost": "10",
    "timespan": "5",
    "project_id": "prop2489",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Sonibariartek Government Primary School",
    "location": "Rupganj",
    "latitude": "23.8284438",
    "longitude": "90.4916385",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop5950",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Sonibariartek General Hospital",
    "location": "Rupganj",
    "latitude": "23.8284438",
    "longitude": "90.4916385",
    "exec": "LGD",
    "cost": "18",
    "timespan": "5",
    "project_id": "prop9689",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Sonibariartek Community Park",
    "location": "Rupganj",
    "latitude": "23.8284438",
    "longitude": "90.4916385",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop5592",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kanchan Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8316428",
    "longitude": "90.558248",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop1797",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kanchan Community Park",
    "location": "Kanchan",
    "latitude": "23.8316428",
    "longitude": "90.558248",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop4003",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Yusufganj General Hospital",
    "location": "Rupganj",
    "latitude": "23.8346268",
    "longitude": "90.4883393",
    "exec": "LGD",
    "cost": "7",
    "timespan": "5",
    "project_id": "prop9468",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Yusufganj Community Park",
    "location": "Rupganj",
    "latitude": "23.8346268",
    "longitude": "90.4883393",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop1775",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Gutiabo Community Park",
    "location": "Rupganj",
    "latitude": "23.8352253",
    "longitude": "90.5276705",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop2772",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kenduapara Community Park",
    "location": "Kanchan",
    "latitude": "23.8353554",
    "longitude": "90.5554791",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop7445",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Chowdhurypara Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8363742",
    "longitude": "90.5696117",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop2499",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Chowdhurypara General Hospital",
    "location": "Kanchan",
    "latitude": "23.8363742",
    "longitude": "90.5696117",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "prop1516",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Poshi Harar Bari Community Park",
    "location": "Rupganj",
    "latitude": "23.8385501",
    "longitude": "90.4902048",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop6782",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 41 Gutulia Government Primary School",
    "location": "Bholabo",
    "latitude": "23.8407364",
    "longitude": "90.600486",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop8928",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 41 Gutulia General Hospital",
    "location": "Bholabo",
    "latitude": "23.8407364",
    "longitude": "90.600486",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "prop2445",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 41 Gutulia Community Park",
    "location": "Bholabo",
    "latitude": "23.8407364",
    "longitude": "90.600486",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop1506",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 40 Kortia Pubergaon General Hospital",
    "location": "Bholabo",
    "latitude": "23.84080923",
    "longitude": "90.58791205",
    "exec": "LGD",
    "cost": "13",
    "timespan": "5",
    "project_id": "prop2564",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 40 Kortia Pubergaon Community Park",
    "location": "Bholabo",
    "latitude": "23.84080923",
    "longitude": "90.58791205",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop3140",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Ranipura Community Park",
    "location": "Kanchan",
    "latitude": "23.8414317",
    "longitude": "90.5716043",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop8244",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kamta Government Primary School",
    "location": "Daudpur",
    "latitude": "23.8554456",
    "longitude": "90.5105671",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop1452",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kamta General Hospital",
    "location": "Daudpur",
    "latitude": "23.8554456",
    "longitude": "90.5105671",
    "exec": "LGD",
    "cost": "23",
    "timespan": "5",
    "project_id": "prop9544",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kamta Community Park",
    "location": "Daudpur",
    "latitude": "23.8554456",
    "longitude": "90.5105671",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop3168",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Birabo Community Park",
    "location": "Kanchan",
    "latitude": "23.8569547",
    "longitude": "90.5536643",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop2826",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Taroil Government Primary School",
    "location": "Kanchan",
    "latitude": "23.8639508",
    "longitude": "90.5646438",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop9230",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Hirnal Government Primary School",
    "location": "Daudpur",
    "latitude": "23.8641457",
    "longitude": "90.4105208",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop6520",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Taroil Birabo Government Primary School",
    "location": "Kanchan",
    "latitude": "23.865362",
    "longitude": "90.5619884",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop4340",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Jinda Government Primary School",
    "location": "Daudpur",
    "latitude": "23.8709465",
    "longitude": "90.5207756",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "prop5975",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Boilda Government Primary School",
    "location": "Daudpur",
    "latitude": "23.8768134",
    "longitude": "90.5353583",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop3345",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 37 Bholabo Community Park",
    "location": "Bholabo",
    "latitude": "23.8779349",
    "longitude": "90.5878684",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop9004",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Rohila General Hospital",
    "location": "Daudpur",
    "latitude": "23.8792481",
    "longitude": "90.553981",
    "exec": "LGD",
    "cost": "6",
    "timespan": "5",
    "project_id": "prop8729",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Purbo Daudpur Government Primary School",
    "location": "Daudpur",
    "latitude": "23.882795",
    "longitude": "90.5764378",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop9838",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Purbo Daudpur Community Park",
    "location": "Daudpur",
    "latitude": "23.882795",
    "longitude": "90.5764378",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop8636",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bholabo Adorsho Government Primary School",
    "location": "Bholabo",
    "latitude": "23.88374878",
    "longitude": "90.59371233",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop9469",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bholabo Adorsho Community Park",
    "location": "Bholabo",
    "latitude": "23.88374878",
    "longitude": "90.59371233",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop7857",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Dakkhin Khaishayir Government Primary School",
    "location": "Daudpur",
    "latitude": "23.88500201",
    "longitude": "90.58278166",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop1396",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Dakkhin Khaishayir General Hospital",
    "location": "Daudpur",
    "latitude": "23.88500201",
    "longitude": "90.58278166",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "prop8726",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Dakkhin Khaishayir Community Park",
    "location": "Daudpur",
    "latitude": "23.88500201",
    "longitude": "90.58278166",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop6857",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Daudpur Government Primary School",
    "location": "Daudpur",
    "latitude": "23.8878345",
    "longitude": "90.5722163",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "prop8020",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 36 Taora Government Primary School",
    "location": "Bholabo",
    "latitude": "23.889097",
    "longitude": "90.6037515",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop7659",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 36 Taora General Hospital",
    "location": "Bholabo",
    "latitude": "23.889097",
    "longitude": "90.6037515",
    "exec": "LGD",
    "cost": "22",
    "timespan": "5",
    "project_id": "prop5126",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "No. 36 Taora Community Park",
    "location": "Bholabo",
    "latitude": "23.889097",
    "longitude": "90.6037515",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop7316",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Agla General Hospital",
    "location": "Daudpur",
    "latitude": "23.8915917",
    "longitude": "90.5606133",
    "exec": "LGD",
    "cost": "9",
    "timespan": "5",
    "project_id": "prop1324",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Agla Community Park",
    "location": "Daudpur",
    "latitude": "23.8915917",
    "longitude": "90.5606133",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop8812",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bodamoynaguri Government Primary School",
    "location": "Debnagar",
    "latitude": "26.4204885",
    "longitude": "88.5061948",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop7176",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bodamoynaguri General Hospital",
    "location": "Debnagar",
    "latitude": "26.4204885",
    "longitude": "88.5061948",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "prop2789",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Khatiagochh Community Park",
    "location": "Debnagar",
    "latitude": "26.4473367",
    "longitude": "88.49846",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop8400",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bhojonpur Government Primary School",
    "location": "Bhojonpur",
    "latitude": "26.469149",
    "longitude": "88.483176",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop6110",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Jhalingigochh Government Primary School",
    "location": "Debnagar",
    "latitude": "26.4695022",
    "longitude": "88.4868529",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop7304",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Jhalingigochh General Hospital",
    "location": "Debnagar",
    "latitude": "26.4695022",
    "longitude": "88.4868529",
    "exec": "LGD",
    "cost": "7",
    "timespan": "5",
    "project_id": "prop5189",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Dorjipara Government Primary School",
    "location": "Tetulia",
    "latitude": "26.4753859",
    "longitude": "88.3486083",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop4923",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Dorjipara General Hospital",
    "location": "Tetulia",
    "latitude": "26.4753859",
    "longitude": "88.3486083",
    "exec": "LGD",
    "cost": "21",
    "timespan": "5",
    "project_id": "prop3227",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Dorjipara Community Park",
    "location": "Tetulia",
    "latitude": "26.4753859",
    "longitude": "88.3486083",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop6368",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Maaligochh General Hospital",
    "location": "Bhojonpur",
    "latitude": "26.482545",
    "longitude": "88.4748633",
    "exec": "LGD",
    "cost": "11",
    "timespan": "5",
    "project_id": "prop8677",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Majhipara General Hospital",
    "location": "Shalbahan",
    "latitude": "26.4834629",
    "longitude": "88.421677",
    "exec": "LGD",
    "cost": "6",
    "timespan": "5",
    "project_id": "prop7422",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Ajeej Nagar General Hospital",
    "location": "Tetulia",
    "latitude": "26.48788874",
    "longitude": "88.36001292",
    "exec": "LGD",
    "cost": "24",
    "timespan": "5",
    "project_id": "prop7187",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Aamjuani General Hospital",
    "location": "Debnagar",
    "latitude": "26.4897783",
    "longitude": "88.5119467",
    "exec": "LGD",
    "cost": "11",
    "timespan": "5",
    "project_id": "prop3641",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Jaamriguri General Hospital",
    "location": "Shalbahan",
    "latitude": "26.4910106",
    "longitude": "88.396602",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "prop8557",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bowalmaari Government Primary School",
    "location": "Shalbahan",
    "latitude": "26.4928829",
    "longitude": "88.3382535",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop6847",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Boiragigochh Government Primary School",
    "location": "Bhojonpur",
    "latitude": "26.4940049",
    "longitude": "88.4721835",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop5548",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kalandigochh Government Primary School",
    "location": "Shalbahan",
    "latitude": "26.4959354",
    "longitude": "88.3880342",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop7831",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Kalandigochh General Hospital",
    "location": "Shalbahan",
    "latitude": "26.4959354",
    "longitude": "88.3880342",
    "exec": "LGD",
    "cost": "10",
    "timespan": "5",
    "project_id": "prop6683",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Tetulia Model Community Park",
    "location": "Tetulia",
    "latitude": "26.49784",
    "longitude": "88.33755",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop3692",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Mathafata General Hospital",
    "location": "Tetulia",
    "latitude": "26.50265452",
    "longitude": "88.37025024",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "prop5630",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Nondogochh Government Primary School",
    "location": "Debnagar",
    "latitude": "26.5030717",
    "longitude": "88.510585",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "prop8189",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Boro Duliagochh Community Park",
    "location": "Shalbahan",
    "latitude": "26.5083906",
    "longitude": "88.38943675",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop1582",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Geetalgoch General Hospital",
    "location": "Bhojonpur",
    "latitude": "26.5086811",
    "longitude": "88.4719455",
    "exec": "LGD",
    "cost": "10",
    "timespan": "5",
    "project_id": "prop5091",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "B.C.B Government Primary School",
    "location": "Tetulia",
    "latitude": "26.51161166",
    "longitude": "88.37668117",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop8658",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "B.C.B General Hospital",
    "location": "Tetulia",
    "latitude": "26.51161166",
    "longitude": "88.37668117",
    "exec": "LGD",
    "cost": "25",
    "timespan": "5",
    "project_id": "prop7548",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "B.C.B Community Park",
    "location": "Tetulia",
    "latitude": "26.51161166",
    "longitude": "88.37668117",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop8847",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bhodesshor Government Primary School",
    "location": "Bhojonpur",
    "latitude": "26.51410659",
    "longitude": "88.48702256",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop2169",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bhodesshor Community Park",
    "location": "Bhojonpur",
    "latitude": "26.51410659",
    "longitude": "88.48702256",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop9123",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Khalpara Government Primary School",
    "location": "Tetulia",
    "latitude": "26.5162188",
    "longitude": "88.3886477",
    "exec": "MOEDU",
    "cost": "1",
    "timespan": "3",
    "project_id": "prop5450",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Lohokachi General Hospital",
    "location": "Shalbahan",
    "latitude": "26.530352",
    "longitude": "88.4092735",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "prop3766",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Lohokachi Community Park",
    "location": "Shalbahan",
    "latitude": "26.530352",
    "longitude": "88.4092735",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop8318",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Ronochondi General Hospital",
    "location": "Tetulia",
    "latitude": "26.5324052",
    "longitude": "88.3649777",
    "exec": "LGD",
    "cost": "13",
    "timespan": "5",
    "project_id": "prop2586",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Islampur General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.5369314",
    "longitude": "88.3659623",
    "exec": "LGD",
    "cost": "11",
    "timespan": "5",
    "project_id": "prop4753",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Islampur Community Park",
    "location": "Tirnoihat",
    "latitude": "26.5369314",
    "longitude": "88.3659623",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop8811",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bholajoat Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.5372393",
    "longitude": "88.393252",
    "exec": "MOEDU",
    "cost": "2",
    "timespan": "3",
    "project_id": "prop8256",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bholajoat General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.5372393",
    "longitude": "88.393252",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "prop7477",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Abdul Hakim & Abdul Motin General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.541235",
    "longitude": "88.387245",
    "exec": "LGD",
    "cost": "5",
    "timespan": "5",
    "project_id": "prop6667",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Abdul Hakim & Abdul Motin Community Park",
    "location": "Tirnoihat",
    "latitude": "26.541235",
    "longitude": "88.387245",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop8129",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Khoykhaatpara Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.5524062",
    "longitude": "88.37556671",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop2653",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Khoykhaatpara General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.5524062",
    "longitude": "88.37556671",
    "exec": "LGD",
    "cost": "15",
    "timespan": "5",
    "project_id": "prop5495",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Mondolpara Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.55872",
    "longitude": "88.426121",
    "exec": "MOEDU",
    "cost": "4",
    "timespan": "3",
    "project_id": "prop6349",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Mondolpara Community Park",
    "location": "Tirnoihat",
    "latitude": "26.55872",
    "longitude": "88.426121",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop7779",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Hakimpur Gowabari Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.5592497",
    "longitude": "88.4011493",
    "exec": "MOEDU",
    "cost": "5",
    "timespan": "3",
    "project_id": "prop2649",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Hakimpur Gowabari General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.5592497",
    "longitude": "88.4011493",
    "exec": "LGD",
    "cost": "22",
    "timespan": "5",
    "project_id": "prop1717",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Hakimpur Gowabari Community Park",
    "location": "Tirnoihat",
    "latitude": "26.5592497",
    "longitude": "88.4011493",
    "exec": "LGD",
    "cost": "1",
    "timespan": "1",
    "project_id": "prop4646",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Tirnoihaat Government Primary School",
    "location": "Tirnoihat",
    "latitude": "26.5669163",
    "longitude": "88.3833702",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop8759",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Tirnoihaat General Hospital",
    "location": "Tirnoihat",
    "latitude": "26.5669163",
    "longitude": "88.3833702",
    "exec": "LGD",
    "cost": "17",
    "timespan": "5",
    "project_id": "prop6725",
    "goal": "Extending healthcare facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Tirnoihaat Community Park",
    "location": "Tirnoihat",
    "latitude": "26.5669163",
    "longitude": "88.3833702",
    "exec": "LGD",
    "cost": "2",
    "timespan": "1",
    "project_id": "prop5145",
    "goal": "Extending recreational facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Sipaipara Government Primary School",
    "location": "Banglabandha",
    "latitude": "26.5886617",
    "longitude": "88.3946118",
    "exec": "MOEDU",
    "cost": "3",
    "timespan": "3",
    "project_id": "prop7518",
    "goal": "Extending education facilities to the neighborhood",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Sayed Nazrul Islam Bridge",
    "location": "Kishoreganj,Brahmanbaria",
    "latitude": "24.044611",
    "longitude": "90.995778",
    "exec": "PWD",
    "cost": "1190",
    "timespan": "5",
    "project_id": "prop1737",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Payra Bridge",
    "location": "Barisal,Patuakhali",
    "latitude": "22.465417",
    "longitude": "90.341083",
    "exec": "BBA",
    "cost": "1740",
    "timespan": "5",
    "project_id": "prop9396",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Abdur Rob Serniabat Bridge",
    "location": "Barisal",
    "latitude": "22.663611",
    "longitude": "90.355083",
    "exec": "BBA",
    "cost": "1230",
    "timespan": "5",
    "project_id": "prop8063",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Patuakhali Bridge",
    "location": "Patuakhali",
    "latitude": "22.368333",
    "longitude": "90.321056",
    "exec": "LGED",
    "cost": "850",
    "timespan": "5",
    "project_id": "prop3522",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Gabkhan Bridge 5th Bangladesh-China Friendship Bridge",
    "location": "Jhalokati",
    "latitude": "22.641222",
    "longitude": "90.178917",
    "exec": "PWD",
    "cost": "1640",
    "timespan": "5",
    "project_id": "prop9782",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Mukterpur Bridge 6th Bangladesh-China Friendship Bridge",
    "location": "Munshiganj",
    "latitude": "23.569528",
    "longitude": "90.512389",
    "exec": "LGED",
    "cost": "1030",
    "timespan": "5",
    "project_id": "prop5244",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Bekutia Bridge 8th Bangladesh-China Friendship Bridge",
    "location": "Pirojpur",
    "latitude": "22.575028",
    "longitude": "90.029778",
    "exec": "LGED",
    "cost": "1500",
    "timespan": "5",
    "project_id": "prop6225",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  },
  {
    "name": "Shambhuganj Bridge 2nd Bangladesh-China Friendship Bridge",
    "location": "Munshiganj",
    "latitude": "23.569528",
    "longitude": "90.512389",
    "exec": "PWD",
    "cost": "920",
    "timespan": "5",
    "project_id": "prop8240",
    "goal": "Improving structural strength of the bridge",
    "proposal_date": "2022-12-20"
  }
];

export const rawComponents = [
  {
    "project_id": "proj9280",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1459",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj9280",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3869",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj9681",
    "ececuting_agency": "LGD",
    "component_id": "comp4745",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj9681",
    "ececuting_agency": "LGD",
    "component_id": "comp3027",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3281",
    "ececuting_agency": "LGD",
    "component_id": "comp2119",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3281",
    "ececuting_agency": "LGD",
    "component_id": "comp3065",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj4207",
    "ececuting_agency": "MOEDU",
    "component_id": "comp426",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj4207",
    "ececuting_agency": "MOEDU",
    "component_id": "comp911",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj9465",
    "ececuting_agency": "LGD",
    "component_id": "comp1703",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj9465",
    "ececuting_agency": "LGD",
    "component_id": "comp2189",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2754",
    "ececuting_agency": "LGD",
    "component_id": "comp3242",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2754",
    "ececuting_agency": "LGD",
    "component_id": "comp4086",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5283",
    "ececuting_agency": "LGD",
    "component_id": "comp3597",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5283",
    "ececuting_agency": "LGD",
    "component_id": "comp3871",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4588",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2290",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4588",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4155",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3724",
    "ececuting_agency": "LGD",
    "component_id": "comp3660",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3724",
    "ececuting_agency": "LGD",
    "component_id": "comp4684",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj4968",
    "ececuting_agency": "LGD",
    "component_id": "comp4256",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj4968",
    "ececuting_agency": "LGD",
    "component_id": "comp1904",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1080",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4396",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1080",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1731",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3173",
    "ececuting_agency": "LGD",
    "component_id": "comp3861",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3173",
    "ececuting_agency": "LGD",
    "component_id": "comp1948",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj8114",
    "ececuting_agency": "LGD",
    "component_id": "comp1932",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj8114",
    "ececuting_agency": "LGD",
    "component_id": "comp3228",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj2485",
    "ececuting_agency": "MOEDU",
    "component_id": "comp163",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj2485",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1166",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj9736",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2355",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj9736",
    "ececuting_agency": "MOEDU",
    "component_id": "comp199",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj1810",
    "ececuting_agency": "MOEDU",
    "component_id": "comp264",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj1810",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2888",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj6981",
    "ececuting_agency": "LGD",
    "component_id": "comp3302",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj6981",
    "ececuting_agency": "LGD",
    "component_id": "comp4291",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3316",
    "ececuting_agency": "LGD",
    "component_id": "comp3519",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3316",
    "ececuting_agency": "LGD",
    "component_id": "comp4539",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj7726",
    "ececuting_agency": "LGD",
    "component_id": "comp81",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj7726",
    "ececuting_agency": "LGD",
    "component_id": "comp1750",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4907",
    "ececuting_agency": "LGD",
    "component_id": "comp2124",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4907",
    "ececuting_agency": "LGD",
    "component_id": "comp4307",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4048",
    "ececuting_agency": "LGD",
    "component_id": "comp4566",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4048",
    "ececuting_agency": "LGD",
    "component_id": "comp4830",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj1430",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2388",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj1430",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1172",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4932",
    "ececuting_agency": "LGD",
    "component_id": "comp226",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4932",
    "ececuting_agency": "LGD",
    "component_id": "comp3200",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj8071",
    "ececuting_agency": "LGD",
    "component_id": "comp4823",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj8071",
    "ececuting_agency": "LGD",
    "component_id": "comp3237",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj1759",
    "ececuting_agency": "LGD",
    "component_id": "comp1326",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj1759",
    "ececuting_agency": "LGD",
    "component_id": "comp4862",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4893",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1971",
    "component_type": "goods",
    "depends_on": "comp4708",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4893",
    "ececuting_agency": "MOEDU",
    "component_id": "comp572",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5028",
    "ececuting_agency": "LGD",
    "component_id": "comp3902",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5028",
    "ececuting_agency": "LGD",
    "component_id": "comp1863",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5163",
    "ececuting_agency": "LGD",
    "component_id": "comp148",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5163",
    "ececuting_agency": "LGD",
    "component_id": "comp3801",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1587",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4708",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1587",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1237",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4224",
    "ececuting_agency": "LGD",
    "component_id": "comp4626",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4224",
    "ececuting_agency": "LGD",
    "component_id": "comp753",
    "component_type": "works",
    "depends_on": "comp1322",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj7787",
    "ececuting_agency": "LGD",
    "component_id": "comp1322",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj7787",
    "ececuting_agency": "LGD",
    "component_id": "comp3084",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj3971",
    "ececuting_agency": "LGD",
    "component_id": "comp3176",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj3971",
    "ececuting_agency": "LGD",
    "component_id": "comp2426",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj7880",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2055",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj7880",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3661",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj7688",
    "ececuting_agency": "LGD",
    "component_id": "comp984",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj7688",
    "ececuting_agency": "LGD",
    "component_id": "comp1139",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj6340",
    "ececuting_agency": "LGD",
    "component_id": "comp4288",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj6340",
    "ececuting_agency": "LGD",
    "component_id": "comp2621",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5660",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1666",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5660",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1557",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj4979",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2465",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj4979",
    "ececuting_agency": "MOEDU",
    "component_id": "comp441",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj3331",
    "ececuting_agency": "LGD",
    "component_id": "comp4774",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj3331",
    "ececuting_agency": "LGD",
    "component_id": "comp892",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj1227",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3545",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj1227",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4813",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj6752",
    "ececuting_agency": "LGD",
    "component_id": "comp2840",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj6752",
    "ececuting_agency": "LGD",
    "component_id": "comp3146",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj5060",
    "ececuting_agency": "LGD",
    "component_id": "comp2810",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj5060",
    "ececuting_agency": "LGD",
    "component_id": "comp217",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5731",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4857",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5731",
    "ececuting_agency": "MOEDU",
    "component_id": "comp639",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5233",
    "ececuting_agency": "LGD",
    "component_id": "comp3978",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5233",
    "ececuting_agency": "LGD",
    "component_id": "comp1424",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj8315",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1388",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj8315",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4383",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2607",
    "ececuting_agency": "MOEDU",
    "component_id": "comp200",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2607",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4009",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj3213",
    "ececuting_agency": "LGD",
    "component_id": "comp3235",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj3213",
    "ececuting_agency": "LGD",
    "component_id": "comp3085",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj8573",
    "ececuting_agency": "MOEDU",
    "component_id": "comp537",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj8573",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2409",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj8106",
    "ececuting_agency": "LGD",
    "component_id": "comp3265",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj8106",
    "ececuting_agency": "LGD",
    "component_id": "comp3223",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5458",
    "ececuting_agency": "LGD",
    "component_id": "comp43",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5458",
    "ececuting_agency": "LGD",
    "component_id": "comp4298",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj3407",
    "ececuting_agency": "LGD",
    "component_id": "comp2197",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj3407",
    "ececuting_agency": "LGD",
    "component_id": "comp2347",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5197",
    "ececuting_agency": "LGD",
    "component_id": "comp252",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5197",
    "ececuting_agency": "LGD",
    "component_id": "comp1795",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5810",
    "ececuting_agency": "LGD",
    "component_id": "comp4348",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5810",
    "ececuting_agency": "LGD",
    "component_id": "comp1401",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj9522",
    "ececuting_agency": "LGD",
    "component_id": "comp977",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj9522",
    "ececuting_agency": "LGD",
    "component_id": "comp439",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5373",
    "ececuting_agency": "LGD",
    "component_id": "comp796",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5373",
    "ececuting_agency": "LGD",
    "component_id": "comp3998",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj6241",
    "ececuting_agency": "LGD",
    "component_id": "comp1307",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj6241",
    "ececuting_agency": "LGD",
    "component_id": "comp1879",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj9906",
    "ececuting_agency": "LGD",
    "component_id": "comp111",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj9906",
    "ececuting_agency": "LGD",
    "component_id": "comp2477",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2298",
    "ececuting_agency": "LGD",
    "component_id": "comp4354",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2298",
    "ececuting_agency": "LGD",
    "component_id": "comp85",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj8160",
    "ececuting_agency": "LGD",
    "component_id": "comp2849",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj8160",
    "ececuting_agency": "LGD",
    "component_id": "comp2470",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj9843",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1788",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj9843",
    "ececuting_agency": "MOEDU",
    "component_id": "comp653",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4482",
    "ececuting_agency": "LGD",
    "component_id": "comp3993",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4482",
    "ececuting_agency": "LGD",
    "component_id": "comp2513",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5770",
    "ececuting_agency": "LGD",
    "component_id": "comp3460",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5770",
    "ececuting_agency": "LGD",
    "component_id": "comp2568",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj5838",
    "ececuting_agency": "LGD",
    "component_id": "comp2195",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj5838",
    "ececuting_agency": "LGD",
    "component_id": "comp894",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2669",
    "ececuting_agency": "LGD",
    "component_id": "comp1773",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2669",
    "ececuting_agency": "LGD",
    "component_id": "comp3289",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj3215",
    "ececuting_agency": "LGD",
    "component_id": "comp1807",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj3215",
    "ececuting_agency": "LGD",
    "component_id": "comp915",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj7747",
    "ececuting_agency": "LGD",
    "component_id": "comp577",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj7747",
    "ececuting_agency": "LGD",
    "component_id": "comp4367",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3806",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2390",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3806",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2815",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5414",
    "ececuting_agency": "LGD",
    "component_id": "comp4171",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5414",
    "ececuting_agency": "LGD",
    "component_id": "comp2532",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj7741",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2648",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj7741",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2902",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj8325",
    "ececuting_agency": "LGD",
    "component_id": "comp2374",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj8325",
    "ececuting_agency": "LGD",
    "component_id": "comp1363",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj1907",
    "ececuting_agency": "LGD",
    "component_id": "comp3404",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj1907",
    "ececuting_agency": "LGD",
    "component_id": "comp4988",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1206",
    "ececuting_agency": "LGD",
    "component_id": "comp122",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1206",
    "ececuting_agency": "LGD",
    "component_id": "comp136",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2458",
    "ececuting_agency": "LGD",
    "component_id": "comp509",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2458",
    "ececuting_agency": "LGD",
    "component_id": "comp4083",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj6016",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1078",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj6016",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4817",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1092",
    "ececuting_agency": "LGD",
    "component_id": "comp676",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1092",
    "ececuting_agency": "LGD",
    "component_id": "comp679",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5547",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3039",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5547",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1983",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5879",
    "ececuting_agency": "LGD",
    "component_id": "comp135",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5879",
    "ececuting_agency": "LGD",
    "component_id": "comp1105",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4849",
    "ececuting_agency": "MOEDU",
    "component_id": "comp15",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4849",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3778",
    "ececuting_agency": "LGD",
    "component_id": "comp4398",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3778",
    "ececuting_agency": "LGD",
    "component_id": "comp2206",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj2387",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3693",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj2387",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2309",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj5580",
    "ececuting_agency": "LGD",
    "component_id": "comp2248",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj5580",
    "ececuting_agency": "LGD",
    "component_id": "comp1577",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj9285",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1455",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj9285",
    "ececuting_agency": "MOEDU",
    "component_id": "comp160",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj9956",
    "ececuting_agency": "LGD",
    "component_id": "comp3438",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj9956",
    "ececuting_agency": "LGD",
    "component_id": "comp2628",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj8269",
    "ececuting_agency": "LGD",
    "component_id": "comp1634",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj8269",
    "ececuting_agency": "LGD",
    "component_id": "comp2861",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj8816",
    "ececuting_agency": "LGD",
    "component_id": "comp1319",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj8816",
    "ececuting_agency": "LGD",
    "component_id": "comp518",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj9488",
    "ececuting_agency": "LGD",
    "component_id": "comp4232",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj9488",
    "ececuting_agency": "LGD",
    "component_id": "comp482",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj9145",
    "ececuting_agency": "LGD",
    "component_id": "comp2665",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj9145",
    "ececuting_agency": "LGD",
    "component_id": "comp2904",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3469",
    "ececuting_agency": "LGD",
    "component_id": "comp3334",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3469",
    "ececuting_agency": "LGD",
    "component_id": "comp3314",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5145",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4043",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5145",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3279",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj6393",
    "ececuting_agency": "LGD",
    "component_id": "comp3162",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj6393",
    "ececuting_agency": "LGD",
    "component_id": "comp3858",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4919",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3769",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4919",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1176",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5951",
    "ececuting_agency": "LGD",
    "component_id": "comp274",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5951",
    "ececuting_agency": "LGD",
    "component_id": "comp4162",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1718",
    "ececuting_agency": "LGD",
    "component_id": "comp1167",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1718",
    "ececuting_agency": "LGD",
    "component_id": "comp2089",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4900",
    "ececuting_agency": "LGD",
    "component_id": "comp2618",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4900",
    "ececuting_agency": "LGD",
    "component_id": "comp1196",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5711",
    "ececuting_agency": "LGD",
    "component_id": "comp2640",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5711",
    "ececuting_agency": "LGD",
    "component_id": "comp3623",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj3120",
    "ececuting_agency": "LGD",
    "component_id": "comp2456",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj3120",
    "ececuting_agency": "LGD",
    "component_id": "comp979",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3348",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3171",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3348",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1853",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj1181",
    "ececuting_agency": "LGD",
    "component_id": "comp2519",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj1181",
    "ececuting_agency": "LGD",
    "component_id": "comp1596",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1106",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2813",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1106",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1662",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3490",
    "ececuting_agency": "LGD",
    "component_id": "comp2151",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3490",
    "ececuting_agency": "LGD",
    "component_id": "comp3811",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj8293",
    "ececuting_agency": "LGD",
    "component_id": "comp1523",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj8293",
    "ececuting_agency": "LGD",
    "component_id": "comp3472",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4903",
    "ececuting_agency": "LGD",
    "component_id": "comp2653",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4903",
    "ececuting_agency": "LGD",
    "component_id": "comp2275",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj5450",
    "ececuting_agency": "LGD",
    "component_id": "comp4561",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj5450",
    "ececuting_agency": "LGD",
    "component_id": "comp65",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj6242",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1302",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj6242",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3590",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj5114",
    "ececuting_agency": "LGD",
    "component_id": "comp106",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj5114",
    "ececuting_agency": "LGD",
    "component_id": "comp3876",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4135",
    "ececuting_agency": "LGD",
    "component_id": "comp844",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4135",
    "ececuting_agency": "LGD",
    "component_id": "comp1981",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj8267",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3315",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj8267",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4448",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj8932",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3048",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj8932",
    "ececuting_agency": "MOEDU",
    "component_id": "comp225",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj7575",
    "ececuting_agency": "LGD",
    "component_id": "comp2021",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj7575",
    "ececuting_agency": "LGD",
    "component_id": "comp4384",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj8961",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4289",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj8961",
    "ececuting_agency": "MOEDU",
    "component_id": "comp556",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj7969",
    "ececuting_agency": "LGD",
    "component_id": "comp496",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj7969",
    "ececuting_agency": "LGD",
    "component_id": "comp4425",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2422",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1487",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2422",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1742",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj7301",
    "ececuting_agency": "LGD",
    "component_id": "comp4909",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj7301",
    "ececuting_agency": "LGD",
    "component_id": "comp2905",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1233",
    "ececuting_agency": "MOEDU",
    "component_id": "comp805",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1233",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3551",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj2357",
    "ececuting_agency": "LGD",
    "component_id": "comp1059",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj2357",
    "ececuting_agency": "LGD",
    "component_id": "comp3508",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5020",
    "ececuting_agency": "LGD",
    "component_id": "comp1649",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5020",
    "ececuting_agency": "LGD",
    "component_id": "comp891",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj3936",
    "ececuting_agency": "LGD",
    "component_id": "comp2251",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj3936",
    "ececuting_agency": "LGD",
    "component_id": "comp3736",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj4988",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1010",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj4988",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1411",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj2090",
    "ececuting_agency": "LGD",
    "component_id": "comp2844",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj2090",
    "ececuting_agency": "LGD",
    "component_id": "comp751",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj6294",
    "ececuting_agency": "LGD",
    "component_id": "comp4703",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj6294",
    "ececuting_agency": "LGD",
    "component_id": "comp3497",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj7823",
    "ececuting_agency": "LGD",
    "component_id": "comp4202",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj7823",
    "ececuting_agency": "LGD",
    "component_id": "comp838",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj9099",
    "ececuting_agency": "LGD",
    "component_id": "comp730",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj9099",
    "ececuting_agency": "LGD",
    "component_id": "comp3707",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1235",
    "ececuting_agency": "BBA",
    "component_id": "comp2406",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1235",
    "ececuting_agency": "BBA",
    "component_id": "comp1045",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj3072",
    "ececuting_agency": "LGED",
    "component_id": "comp600",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj3072",
    "ececuting_agency": "LGED",
    "component_id": "comp3191",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj9303",
    "ececuting_agency": "LGED",
    "component_id": "comp2570",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj9303",
    "ececuting_agency": "LGED",
    "component_id": "comp2703",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj5852",
    "ececuting_agency": "LGED",
    "component_id": "comp435",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj5852",
    "ececuting_agency": "LGED",
    "component_id": "comp4152",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj7024",
    "ececuting_agency": "PWD",
    "component_id": "comp4311",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj7024",
    "ececuting_agency": "PWD",
    "component_id": "comp2226",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj5730",
    "ececuting_agency": "PWD",
    "component_id": "comp2276",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj5730",
    "ececuting_agency": "PWD",
    "component_id": "comp4780",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj4716",
    "ececuting_agency": "PWD",
    "component_id": "comp3498",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj4716",
    "ececuting_agency": "PWD",
    "component_id": "comp4944",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj8626",
    "ececuting_agency": "LGED",
    "component_id": "comp3906",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj8626",
    "ececuting_agency": "LGED",
    "component_id": "comp1130",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj6782",
    "ececuting_agency": "PWD",
    "component_id": "comp2108",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj6782",
    "ececuting_agency": "PWD",
    "component_id": "comp2314",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj5876",
    "ececuting_agency": "PWD",
    "component_id": "comp1402",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj5876",
    "ececuting_agency": "PWD",
    "component_id": "comp1595",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "proj1644",
    "ececuting_agency": "BBA",
    "component_id": "comp3582",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "proj1644",
    "ececuting_agency": "BBA",
    "component_id": "comp4303",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "proj7221",
    "ececuting_agency": "LGED",
    "component_id": "comp3947",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "proj7221",
    "ececuting_agency": "LGED",
    "component_id": "comp1491",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "proj1655",
    "ececuting_agency": "LGED",
    "component_id": "comp484",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "proj1655",
    "ececuting_agency": "LGED",
    "component_id": "comp4618",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop3072",
    "ececuting_agency": "LGD",
    "component_id": "comp434",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop3072",
    "ececuting_agency": "LGD",
    "component_id": "comp2835",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7106",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3772",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7106",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1256",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop5730",
    "ececuting_agency": "LGD",
    "component_id": "comp4104",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop5730",
    "ececuting_agency": "LGD",
    "component_id": "comp1536",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop7655",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4790",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop7655",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3618",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop2195",
    "ececuting_agency": "LGD",
    "component_id": "comp3827",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop2195",
    "ececuting_agency": "LGD",
    "component_id": "comp1842",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1114",
    "ececuting_agency": "LGD",
    "component_id": "comp762",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1114",
    "ececuting_agency": "LGD",
    "component_id": "comp2938",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8384",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4761",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8384",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2371",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop4513",
    "ececuting_agency": "LGD",
    "component_id": "comp1720",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop4513",
    "ececuting_agency": "LGD",
    "component_id": "comp2386",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop4527",
    "ececuting_agency": "LGD",
    "component_id": "comp4698",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop4527",
    "ececuting_agency": "LGD",
    "component_id": "comp3377",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop5719",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2057",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop5719",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1668",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop5391",
    "ececuting_agency": "LGD",
    "component_id": "comp4739",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop5391",
    "ececuting_agency": "LGD",
    "component_id": "comp4128",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8439",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4510",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8439",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4091",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9756",
    "ececuting_agency": "LGD",
    "component_id": "comp3005",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9756",
    "ececuting_agency": "LGD",
    "component_id": "comp689",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop2763",
    "ececuting_agency": "LGD",
    "component_id": "comp2664",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop2763",
    "ececuting_agency": "LGD",
    "component_id": "comp1460",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop2863",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3188",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop2863",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4483",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop6579",
    "ececuting_agency": "LGD",
    "component_id": "comp1745",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop6579",
    "ececuting_agency": "LGD",
    "component_id": "comp2134",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop5951",
    "ececuting_agency": "LGD",
    "component_id": "comp1636",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop5951",
    "ececuting_agency": "LGD",
    "component_id": "comp4444",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop3904",
    "ececuting_agency": "LGD",
    "component_id": "comp3813",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop3904",
    "ececuting_agency": "LGD",
    "component_id": "comp1122",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8029",
    "ececuting_agency": "LGD",
    "component_id": "comp2234",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8029",
    "ececuting_agency": "LGD",
    "component_id": "comp3944",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop1397",
    "ececuting_agency": "LGD",
    "component_id": "comp4890",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop1397",
    "ececuting_agency": "LGD",
    "component_id": "comp1185",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop9060",
    "ececuting_agency": "LGD",
    "component_id": "comp4528",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop9060",
    "ececuting_agency": "LGD",
    "component_id": "comp3483",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop6058",
    "ececuting_agency": "LGD",
    "component_id": "comp3103",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop6058",
    "ececuting_agency": "LGD",
    "component_id": "comp1859",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8947",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3347",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8947",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1696",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop4357",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2041",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop4357",
    "ececuting_agency": "MOEDU",
    "component_id": "comp228",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop1518",
    "ececuting_agency": "LGD",
    "component_id": "comp2222",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop1518",
    "ececuting_agency": "LGD",
    "component_id": "comp3581",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7875",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2756",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7875",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2891",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop4964",
    "ececuting_agency": "LGD",
    "component_id": "comp8",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop4964",
    "ececuting_agency": "LGD",
    "component_id": "comp837",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop6967",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4634",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop6967",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4107",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop9012",
    "ececuting_agency": "LGD",
    "component_id": "comp1568",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop9012",
    "ececuting_agency": "LGD",
    "component_id": "comp1626",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop3771",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4004",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop3771",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1234",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop6954",
    "ececuting_agency": "LGD",
    "component_id": "comp2833",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop6954",
    "ececuting_agency": "LGD",
    "component_id": "comp4548",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop1387",
    "ececuting_agency": "LGD",
    "component_id": "comp4904",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop1387",
    "ececuting_agency": "LGD",
    "component_id": "comp2026",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop7523",
    "ececuting_agency": "LGD",
    "component_id": "comp4137",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop7523",
    "ececuting_agency": "LGD",
    "component_id": "comp2710",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop6974",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2655",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop6974",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2076",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop2489",
    "ececuting_agency": "LGD",
    "component_id": "comp2651",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop2489",
    "ececuting_agency": "LGD",
    "component_id": "comp3800",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop5950",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2048",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop5950",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3713",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9689",
    "ececuting_agency": "LGD",
    "component_id": "comp3664",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9689",
    "ececuting_agency": "LGD",
    "component_id": "comp104",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop5592",
    "ececuting_agency": "LGD",
    "component_id": "comp4357",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop5592",
    "ececuting_agency": "LGD",
    "component_id": "comp3154",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1797",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1073",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1797",
    "ececuting_agency": "MOEDU",
    "component_id": "comp50",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop4003",
    "ececuting_agency": "LGD",
    "component_id": "comp4509",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop4003",
    "ececuting_agency": "LGD",
    "component_id": "comp4584",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop9468",
    "ececuting_agency": "LGD",
    "component_id": "comp1422",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop9468",
    "ececuting_agency": "LGD",
    "component_id": "comp1407",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1775",
    "ececuting_agency": "LGD",
    "component_id": "comp4427",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1775",
    "ececuting_agency": "LGD",
    "component_id": "comp4218",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop2772",
    "ececuting_agency": "LGD",
    "component_id": "comp906",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop2772",
    "ececuting_agency": "LGD",
    "component_id": "comp4286",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7445",
    "ececuting_agency": "LGD",
    "component_id": "comp366",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7445",
    "ececuting_agency": "LGD",
    "component_id": "comp319",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop2499",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4125",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop2499",
    "ececuting_agency": "MOEDU",
    "component_id": "comp991",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop1516",
    "ececuting_agency": "LGD",
    "component_id": "comp2097",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop1516",
    "ececuting_agency": "LGD",
    "component_id": "comp586",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop6782",
    "ececuting_agency": "LGD",
    "component_id": "comp772",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop6782",
    "ececuting_agency": "LGD",
    "component_id": "comp3803",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8928",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1132",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8928",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3451",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop2445",
    "ececuting_agency": "LGD",
    "component_id": "comp3994",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop2445",
    "ececuting_agency": "LGD",
    "component_id": "comp1814",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop1506",
    "ececuting_agency": "LGD",
    "component_id": "comp1258",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop1506",
    "ececuting_agency": "LGD",
    "component_id": "comp210",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop2564",
    "ececuting_agency": "LGD",
    "component_id": "comp3428",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop2564",
    "ececuting_agency": "LGD",
    "component_id": "comp479",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop3140",
    "ececuting_agency": "LGD",
    "component_id": "comp3974",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop3140",
    "ececuting_agency": "LGD",
    "component_id": "comp3828",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8244",
    "ececuting_agency": "LGD",
    "component_id": "comp3106",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8244",
    "ececuting_agency": "LGD",
    "component_id": "comp566",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1452",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3213",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1452",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3179",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9544",
    "ececuting_agency": "LGD",
    "component_id": "comp3487",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9544",
    "ececuting_agency": "LGD",
    "component_id": "comp172",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop3168",
    "ececuting_agency": "LGD",
    "component_id": "comp1569",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop3168",
    "ececuting_agency": "LGD",
    "component_id": "comp2303",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop2826",
    "ececuting_agency": "LGD",
    "component_id": "comp4902",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop2826",
    "ececuting_agency": "LGD",
    "component_id": "comp2895",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9230",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2315",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9230",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4191",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop6520",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1106",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop6520",
    "ececuting_agency": "MOEDU",
    "component_id": "comp234",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop4340",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2476",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop4340",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3716",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop5975",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4034",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop5975",
    "ececuting_agency": "MOEDU",
    "component_id": "comp771",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop3345",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2088",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop3345",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1923",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop9004",
    "ececuting_agency": "LGD",
    "component_id": "comp2546",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop9004",
    "ececuting_agency": "LGD",
    "component_id": "comp395",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8729",
    "ececuting_agency": "LGD",
    "component_id": "comp3012",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8729",
    "ececuting_agency": "LGD",
    "component_id": "comp187",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop9838",
    "ececuting_agency": "MOEDU",
    "component_id": "comp946",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop9838",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4316",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8636",
    "ececuting_agency": "LGD",
    "component_id": "comp1215",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8636",
    "ececuting_agency": "LGD",
    "component_id": "comp4090",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9469",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1016",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9469",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4712",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7857",
    "ececuting_agency": "LGD",
    "component_id": "comp3013",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7857",
    "ececuting_agency": "LGD",
    "component_id": "comp4587",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1396",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1830",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1396",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2383",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8726",
    "ececuting_agency": "LGD",
    "component_id": "comp4714",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8726",
    "ececuting_agency": "LGD",
    "component_id": "comp2941",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop6857",
    "ececuting_agency": "LGD",
    "component_id": "comp491",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop6857",
    "ececuting_agency": "LGD",
    "component_id": "comp3742",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8020",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4460",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8020",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1441",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop7659",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4410",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop7659",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4365",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop5126",
    "ececuting_agency": "LGD",
    "component_id": "comp193",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop5126",
    "ececuting_agency": "LGD",
    "component_id": "comp4139",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop7316",
    "ececuting_agency": "LGD",
    "component_id": "comp4238",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop7316",
    "ececuting_agency": "LGD",
    "component_id": "comp4728",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop1324",
    "ececuting_agency": "LGD",
    "component_id": "comp1438",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop1324",
    "ececuting_agency": "LGD",
    "component_id": "comp528",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8812",
    "ececuting_agency": "LGD",
    "component_id": "comp2064",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8812",
    "ececuting_agency": "LGD",
    "component_id": "comp2854",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop7176",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1933",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop7176",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1494",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop2789",
    "ececuting_agency": "LGD",
    "component_id": "comp951",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop2789",
    "ececuting_agency": "LGD",
    "component_id": "comp2044",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8400",
    "ececuting_agency": "LGD",
    "component_id": "comp2907",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8400",
    "ececuting_agency": "LGD",
    "component_id": "comp4212",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop6110",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4353",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop6110",
    "ececuting_agency": "MOEDU",
    "component_id": "comp303",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop7304",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2153",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop7304",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4933",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop5189",
    "ececuting_agency": "LGD",
    "component_id": "comp3177",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop5189",
    "ececuting_agency": "LGD",
    "component_id": "comp997",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop4923",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2634",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop4923",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop3227",
    "ececuting_agency": "LGD",
    "component_id": "comp3989",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop3227",
    "ececuting_agency": "LGD",
    "component_id": "comp279",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop6368",
    "ececuting_agency": "LGD",
    "component_id": "comp3307",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop6368",
    "ececuting_agency": "LGD",
    "component_id": "comp1574",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8677",
    "ececuting_agency": "LGD",
    "component_id": "comp3768",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8677",
    "ececuting_agency": "LGD",
    "component_id": "comp3559",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop7422",
    "ececuting_agency": "LGD",
    "component_id": "comp1572",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop7422",
    "ececuting_agency": "LGD",
    "component_id": "comp3923",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7187",
    "ececuting_agency": "LGD",
    "component_id": "comp2367",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7187",
    "ececuting_agency": "LGD",
    "component_id": "comp4250",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop3641",
    "ececuting_agency": "LGD",
    "component_id": "comp2432",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop3641",
    "ececuting_agency": "LGD",
    "component_id": "comp26",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8557",
    "ececuting_agency": "LGD",
    "component_id": "comp1334",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8557",
    "ececuting_agency": "LGD",
    "component_id": "comp137",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop6847",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3212",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop6847",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2776",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop5548",
    "ececuting_agency": "MOEDU",
    "component_id": "comp481",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop5548",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1640",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop7831",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2948",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop7831",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1906",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop6683",
    "ececuting_agency": "LGD",
    "component_id": "comp3865",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop6683",
    "ececuting_agency": "LGD",
    "component_id": "comp3754",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop3692",
    "ececuting_agency": "LGD",
    "component_id": "comp3721",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop3692",
    "ececuting_agency": "LGD",
    "component_id": "comp1840",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop5630",
    "ececuting_agency": "LGD",
    "component_id": "comp3267",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop5630",
    "ececuting_agency": "LGD",
    "component_id": "comp1421",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8189",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1891",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8189",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3842",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1582",
    "ececuting_agency": "LGD",
    "component_id": "comp718",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1582",
    "ececuting_agency": "LGD",
    "component_id": "comp3840",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop5091",
    "ececuting_agency": "LGD",
    "component_id": "comp1284",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop5091",
    "ececuting_agency": "LGD",
    "component_id": "comp3841",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8658",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1164",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8658",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2364",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop7548",
    "ececuting_agency": "LGD",
    "component_id": "comp4046",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop7548",
    "ececuting_agency": "LGD",
    "component_id": "comp4908",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8847",
    "ececuting_agency": "LGD",
    "component_id": "comp2754",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8847",
    "ececuting_agency": "LGD",
    "component_id": "comp2698",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop2169",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4008",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop2169",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3908",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop9123",
    "ececuting_agency": "LGD",
    "component_id": "comp40",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop9123",
    "ececuting_agency": "LGD",
    "component_id": "comp3584",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop5450",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4569",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop5450",
    "ececuting_agency": "MOEDU",
    "component_id": "comp2037",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop3766",
    "ececuting_agency": "LGD",
    "component_id": "comp314",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop3766",
    "ececuting_agency": "LGD",
    "component_id": "comp4094",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8318",
    "ececuting_agency": "LGD",
    "component_id": "comp644",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8318",
    "ececuting_agency": "LGD",
    "component_id": "comp3430",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop2586",
    "ececuting_agency": "LGD",
    "component_id": "comp3860",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop2586",
    "ececuting_agency": "LGD",
    "component_id": "comp1562",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop4753",
    "ececuting_agency": "LGD",
    "component_id": "comp4387",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop4753",
    "ececuting_agency": "LGD",
    "component_id": "comp4296",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop8811",
    "ececuting_agency": "LGD",
    "component_id": "comp245",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop8811",
    "ececuting_agency": "LGD",
    "component_id": "comp1748",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8256",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4420",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8256",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4149",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7477",
    "ececuting_agency": "LGD",
    "component_id": "comp4344",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7477",
    "ececuting_agency": "LGD",
    "component_id": "comp4762",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop6667",
    "ececuting_agency": "LGD",
    "component_id": "comp4687",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop6667",
    "ececuting_agency": "LGD",
    "component_id": "comp4489",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8129",
    "ececuting_agency": "LGD",
    "component_id": "comp327",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8129",
    "ececuting_agency": "LGD",
    "component_id": "comp474",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop2653",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1977",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop2653",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4457",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop5495",
    "ececuting_agency": "LGD",
    "component_id": "comp2217",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop5495",
    "ececuting_agency": "LGD",
    "component_id": "comp2707",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop6349",
    "ececuting_agency": "MOEDU",
    "component_id": "comp3178",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop6349",
    "ececuting_agency": "MOEDU",
    "component_id": "comp859",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7779",
    "ececuting_agency": "LGD",
    "component_id": "comp3680",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop7779",
    "ececuting_agency": "LGD",
    "component_id": "comp2313",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop2649",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4074",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop2649",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4522",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1717",
    "ececuting_agency": "LGD",
    "component_id": "comp1740",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1717",
    "ececuting_agency": "LGD",
    "component_id": "comp2946",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop4646",
    "ececuting_agency": "LGD",
    "component_id": "comp3231",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop4646",
    "ececuting_agency": "LGD",
    "component_id": "comp3705",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8759",
    "ececuting_agency": "MOEDU",
    "component_id": "comp471",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8759",
    "ececuting_agency": "MOEDU",
    "component_id": "comp4190",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop6725",
    "ececuting_agency": "LGD",
    "component_id": "comp563",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop6725",
    "ececuting_agency": "LGD",
    "component_id": "comp3135",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop5145",
    "ececuting_agency": "LGD",
    "component_id": "comp2143",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop5145",
    "ececuting_agency": "LGD",
    "component_id": "comp18",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop7518",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1066",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop7518",
    "ececuting_agency": "MOEDU",
    "component_id": "comp1358",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop1737",
    "ececuting_agency": "PWD",
    "component_id": "comp3282",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop1737",
    "ececuting_agency": "PWD",
    "component_id": "comp2435",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9396",
    "ececuting_agency": "BBA",
    "component_id": "comp2858",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9396",
    "ececuting_agency": "BBA",
    "component_id": "comp3043",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop8063",
    "ececuting_agency": "BBA",
    "component_id": "comp4204",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop8063",
    "ececuting_agency": "BBA",
    "component_id": "comp4662",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop3522",
    "ececuting_agency": "LGED",
    "component_id": "comp1324",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop3522",
    "ececuting_agency": "LGED",
    "component_id": "comp4181",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop9782",
    "ececuting_agency": "PWD",
    "component_id": "comp62",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop9782",
    "ececuting_agency": "PWD",
    "component_id": "comp183",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  },
  {
    "project_id": "prop5244",
    "ececuting_agency": "LGED",
    "component_id": "comp2950",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.4"
  },
  {
    "project_id": "prop5244",
    "ececuting_agency": "LGED",
    "component_id": "comp1011",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.6"
  },
  {
    "project_id": "prop6225",
    "ececuting_agency": "LGED",
    "component_id": "comp3546",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.3"
  },
  {
    "project_id": "prop6225",
    "ececuting_agency": "LGED",
    "component_id": "comp4758",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.7"
  },
  {
    "project_id": "prop8240",
    "ececuting_agency": "PWD",
    "component_id": "comp3175",
    "component_type": "goods",
    "depends_on": "",
    "budget ratio": "0.45"
  },
  {
    "project_id": "prop8240",
    "ececuting_agency": "PWD",
    "component_id": "comp1601",
    "component_type": "works",
    "depends_on": "",
    "budget ratio": "0.55"
  }
];

export const rawUserTypes = [
  {
    "code": "SYSADMIN",
    "committee": "system admin",
    "description": "System admin user group"
  },
  {
    "code": "ECNEC",
    "committee": "Executive Committee of the National Economic Council",
    "description": "DPP approval committee for projects costing over BDT 50 crores"
  },
  {
    "code": "MOP",
    "committee": "Ministry of Planning",
    "description": "DPP approval committee for projects costing up to BDT 50 crores"
  },
  {
    "code": "EXEC",
    "committee": "Executing Agency",
    "description": "Executing agency user group"
  },
  {
    "code": "APP",
    "committee": "Application Users",
    "description": "Citizen application user group"
  }
];
