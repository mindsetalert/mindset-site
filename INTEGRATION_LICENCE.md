# Intégration du système de licences dans le programme Python

## Vue d'ensemble

Le système de licences limite l'utilisation à **1 appareil par licence**. Le programme doit générer un identifiant unique de l'appareil (`hardware_id`) et l'envoyer lors de la validation.

## Génération du Hardware ID

```python
import uuid
import platform

def get_hardware_id():
    """
    Génère un identifiant unique basé sur l'appareil.
    Utilise l'UUID de la machine Windows.
    """
    try:
        # Windows: utilise le UUID de la machine
        if platform.system() == 'Windows':
            import subprocess
            result = subprocess.check_output('wmic csproduct get uuid', shell=True)
            uuid_line = result.decode().split('\n')[1].strip()
            return uuid_line
        else:
            # Fallback: utilise le UUID du node
            return str(uuid.getnode())
    except Exception as e:
        print(f"Erreur génération hardware_id: {e}")
        return None

def get_device_name():
    """Retourne le nom de l'appareil"""
    return platform.node()
```

## Validation de licence (au démarrage du programme)

```python
import requests

def validate_license(license_key):
    """
    Valide la licence auprès du serveur.
    Retourne True si valide, False sinon.
    """
    hardware_id = get_hardware_id()
    device_name = get_device_name()
    
    if not hardware_id:
        print("❌ Impossible de générer l'identifiant matériel")
        return False
    
    try:
        response = requests.post(
            'https://mindset-site.vercel.app/api/validate-license',
            json={
                'licenseKey': license_key,
                'hardwareId': hardware_id,
                'deviceName': device_name
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Licence valide jusqu'au {data['license']['expiresAt']}")
            return True
        elif response.status_code == 403:
            error_data = response.json()
            print(f"❌ {error_data['error']}")
            if 'details' in error_data:
                print(f"   Appareil activé: {error_data['details']['activatedDevice']}")
                print(f"   Activé le: {error_data['details']['activatedAt']}")
            return False
        elif response.status_code == 400:
            error_data = response.json()
            print(f"❌ {error_data['error']}")
            return False
        else:
            print(f"❌ Erreur serveur: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

# Exemple d'utilisation au démarrage
if __name__ == "__main__":
    license_key = input("Entrez votre clé de licence: ")
    
    if validate_license(license_key):
        print("🚀 Programme démarré avec succès")
        # Lancer le programme
    else:
        print("⛔ Impossible de démarrer le programme")
        input("Appuyez sur Entrée pour quitter...")
```

## Désactivation de licence (pour changer d'appareil)

```python
def deactivate_license(license_key):
    """
    Désactive la licence sur cet appareil.
    Permet au client de l'utiliser sur un autre appareil.
    """
    hardware_id = get_hardware_id()
    
    if not hardware_id:
        print("❌ Impossible de générer l'identifiant matériel")
        return False
    
    try:
        response = requests.post(
            'https://mindset-site.vercel.app/api/deactivate-license',
            json={
                'licenseKey': license_key,
                'hardwareId': hardware_id
            },
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Licence désactivée avec succès")
            print("   Vous pouvez maintenant l'activer sur un autre appareil")
            return True
        else:
            error_data = response.json()
            print(f"❌ {error_data.get('error', 'Erreur inconnue')}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de connexion: {e}")
        return False
```

## Intégration dans le programme existant

### 1. Au démarrage (dans `main.py` ou équivalent)

```python
# Charger la licence sauvegardée (fichier local, registre, etc.)
saved_license = load_saved_license()  # votre fonction existante

if saved_license:
    # Valider la licence au démarrage
    if not validate_license(saved_license):
        # Licence invalide ou utilisée ailleurs
        new_license = ask_for_license()  # votre dialogue existant
        if new_license and validate_license(new_license):
            save_license(new_license)
        else:
            sys.exit(1)
else:
    # Première utilisation
    license_key = ask_for_license()
    if license_key and validate_license(license_key):
        save_license(license_key)
    else:
        sys.exit(1)

# Programme démarre normalement
run_main_application()
```

### 2. Périodiquement (optionnel, toutes les 24h)

```python
import time
from threading import Thread

def periodic_validation(license_key):
    """Valide la licence toutes les 24h en arrière-plan"""
    while True:
        time.sleep(24 * 60 * 60)  # 24 heures
        if not validate_license(license_key):
            print("❌ Licence invalide. Le programme va se fermer.")
            sys.exit(1)

# Lancer en thread daemon
validation_thread = Thread(target=periodic_validation, args=(license_key,), daemon=True)
validation_thread.start()
```

### 3. Bouton "Désactiver la licence" dans l'UI

```python
def on_deactivate_button_click():
    """Handler pour le bouton de désactivation"""
    license_key = load_saved_license()
    if license_key:
        if deactivate_license(license_key):
            delete_saved_license()
            messagebox.showinfo("Succès", "Licence désactivée. Vous pouvez maintenant l'activer sur un autre appareil.")
            sys.exit(0)
        else:
            messagebox.showerror("Erreur", "Impossible de désactiver la licence")
```

## Messages d'erreur pour l'utilisateur

| Code | Erreur | Message à afficher |
|------|--------|-------------------|
| 403  | Licence déjà activée sur un autre appareil | "Cette licence est déjà utilisée sur un autre appareil. Désactivez-la d'abord depuis l'autre appareil ou contactez le support." |
| 400  | Licence expirée | "Votre licence a expiré. Veuillez renouveler votre abonnement." |
| 404  | Licence non trouvée | "Clé de licence invalide. Vérifiez votre saisie." |
| 500  | Erreur serveur | "Erreur de connexion au serveur. Réessayez dans quelques instants." |

## Dépendances Python requises

```bash
pip install requests
```

## Test de la fonctionnalité

```python
# Test 1: Première activation
hardware_id_1 = "DEVICE-UUID-123"
validate_license("LIC-ABC123-456", hardware_id_1)  # ✅ Succès

# Test 2: Même appareil, re-validation
validate_license("LIC-ABC123-456", hardware_id_1)  # ✅ Succès

# Test 3: Autre appareil
hardware_id_2 = "DEVICE-UUID-789"
validate_license("LIC-ABC123-456", hardware_id_2)  # ❌ Erreur 403

# Test 4: Désactivation puis activation sur autre appareil
deactivate_license("LIC-ABC123-456", hardware_id_1)  # ✅ Succès
validate_license("LIC-ABC123-456", hardware_id_2)   # ✅ Succès
```

## Notes importantes

1. **Hardware ID stable**: utilise WMIC UUID (Windows) qui persiste même après réinstallation de l'OS
2. **Mode hors ligne**: le programme peut fonctionner sans validation constante, mais doit valider au démarrage
3. **Changement d'appareil**: le client doit désactiver depuis l'appareil actuel avant d'activer sur un nouveau
4. **Support client**: tu peux manuellement réinitialiser `hardware_id` dans Supabase si un client perd son appareil

## URL de production

- Validation: `https://mindset-site.vercel.app/api/validate-license`
- Désactivation: `https://mindset-site.vercel.app/api/deactivate-license`

