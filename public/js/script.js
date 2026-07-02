function deletarMajor(majorIdToDelete) {
    fetch(`/major/remove/${majorIdToDelete}`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                console.log('Major deletado com sucesso');
                window.location.reload();
            } else {
                console.log('Erro ao deletar');
            }
        });
}
