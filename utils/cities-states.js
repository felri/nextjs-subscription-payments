const fs = require('fs');

const json = JSON.parse(fs.readFileSync('estados-cidades.json', 'utf8'));

let sqlStatements = '';

json.estados.forEach((estado) => {
    const sanitizedStateName = estado.nome.replace(/'/g, "''");
    sqlStatements += `DO $$\n`;
    sqlStatements += `DECLARE inserted_state_id INTEGER;\n`; // Renamed the variable here
    sqlStatements += `BEGIN\n`;
    sqlStatements += `INSERT INTO states (sigla, name) VALUES ('${estado.sigla}', '${sanitizedStateName}') RETURNING state_id INTO inserted_state_id;\n`; // Updated here too

    estado.cidades.forEach((cidade) => {
        const sanitizedCityName = cidade.replace(/'/g, "''");
        sqlStatements += `INSERT INTO cities (state_id, name) VALUES (inserted_state_id, '${sanitizedCityName}');\n`; // Updated the variable here
    });

    sqlStatements += `END $$;\n`;
});

fs.writeFileSync('output.sql', sqlStatements);