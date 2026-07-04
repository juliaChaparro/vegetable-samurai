export interface Prof {
    nome: string;
    sala: number
}

export interface Technology {
    name: string;
    type: string;
    poweredByNodejs: boolean;
}

function listProfs(profs: Prof[]) {
    const list = profs.map(p => `<li>${p.nome} - ${p.sala}</li>`).join('')
    return `<ul>${list}</ul>`
}

function listNodeTechnologies(techs: Technology[]) {
    const list = techs
        .filter(t => t.poweredByNodejs)
        .map(t => `<li>${t.name} - ${t.type}</li>`)
        .join('');
    return `<ul>${list}</ul>`;
}

export default {
    listProfs,
    listNodeTechnologies
}